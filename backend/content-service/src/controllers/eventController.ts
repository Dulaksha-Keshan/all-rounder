import axios from 'axios';
import { Request, Response } from "express";
import mongoose, { InferSchemaType } from "mongoose";
import Event from "../mongoose/eventModel.js";
import { deleteFromR2, uploadToR2 } from '../utils/r2Upload.js';


type Host = InferSchemaType<typeof Event.schema>["hosts"][number];

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const uploadedKeys: string[] = []; // For rollback
  try {
    const creatorId = req.headers["x-user-uid"] as string;    // Firebase UID 
    const schoolId = req.headers["x-school-id"] as string;
    const orgId = req.headers["x-organization-id"] as string; // methana school id and organization id wenama ganne nathuwa creator id ek map karamud

    let {
      title,
      description,
      category,
      eventType,
      startDate,
      endDate,
      location,
      organizer,
      eligibility,
      registrationUrl,
      isOnline,
      visibility,
      hosts,   // ← ADD THIS to destructuring
    } = req.body;


    if (hosts && typeof hosts === 'string') {
      try {
        hosts = JSON.parse(hosts);
      } catch (error) {
        res.status(400).json({ message: "Invalid JSON format for hosts" });
        return;
      }
    }

    // Validation (keep as is)
    if (!title || !description || !category || !eventType ||
      !startDate || !endDate || !location || !organizer || !eligibility || (!schoolId && !orgId)) {
      res.status(400).json({ message: "Missing required event fields" });
      return;
    }


    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ message: "Invalid date format" });
      return;
    }

    if (start > end) {
      res.status(400).json({
        message: "Start date cannot be after end date",
      });
      return;
    }

    if (hosts && Array.isArray(hosts)) {
      for (const host of hosts) {
        if (!host.hostType || !host.hostId || !host.hostName) {
          res.status(400).json({
            message: "Invalid host structure",
          });
          return;
        }

        if (!["school", "organization"].includes(host.hostType)) {
          res.status(400).json({
            message: "Host type must be school or organization",
          });
          return;
        }
      }
    }

    // Handle file uploads
    const attachmentUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {


      // Determine key prefix based on primary host or default
      let keyPrefix = 'events';
      if (hosts && hosts.length > 0) {
        const primaryHost = hosts.find((h: Host) => h.isPrimary) || hosts[0];
        keyPrefix = `events/${primaryHost.hostType === 'school' ? 'School' : 'Organizations'}/${primaryHost.hostId}`;
      } else if (schoolId) {
        keyPrefix = `events/School/${schoolId}`;
      } else if (orgId) {
        keyPrefix = `events/Organizations/${orgId}`;
      }

      for (const file of req.files) {
        try {
          const key = `${keyPrefix}/${Date.now()}-${file.originalname}`;
          const url = await uploadToR2(file.buffer, key, file.mimetype);
          attachmentUrls.push(url);
          uploadedKeys.push(key); // Track for rollback
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          // Rollback previous uploads
          for (const key of uploadedKeys) {
            try {
              await deleteFromR2(key);
            } catch (deleteError) {
              console.error('Rollback delete failed:', deleteError);
            }
          }
          res.status(500).json({
            message: "File upload failed",
          });
          return;
        }
      }
    }

    const event = await Event.create({
      title,
      description,
      category,
      eventType,
      startDate: start,
      endDate: end,
      location,
      organizer,
      eligibility,
      registrationUrl,
      isOnline,
      visibility,
      createdBy: creatorId,
      hosts: hosts || [],
      attachments: attachmentUrls,
    });

    let hostMappingSuccessCount = 0;

    // This is the event host mapping step
    if (hosts && hosts.length > 0) {
      for (const host of hosts) {
        try {
          await axios.post(
            `${process.env.USER_SERVICE_URL}/api/event-hosts`,
            {
              eventId: event._id.toString(),  // MongoDB ObjectId as string
              hostType: host.hostType.toUpperCase(), // "SCHOOL" or "ORGANIZATION"
              schoolId: host.hostType === "school" ? host.hostId : null,
              organizationId: host.hostType === "organization" ? host.hostId : null,
              isPrimaryHost: host.isPrimary || false,
            }
          );
          hostMappingSuccessCount++;
        } catch (err) {
          // Log but don't fail the whole request
          console.error("Failed to register host mapping:", err);
        }
      }
    } else {
      // Default host mapping if no hosts provided
      try {
        await axios.post(`${process.env.USER_SERVICE_URL}/api/event-hosts`, {
          eventId: event._id.toString(),
          hostType: schoolId ? "SCHOOL" : "ORGANIZATION",
          schoolId: schoolId || null,
          organizationId: orgId || null,
          isPrimaryHost: true,
        });
        hostMappingSuccessCount++;
      } catch (err) {
        console.error("Default host mapping failed:", err);
      }
    }

    if (hostMappingSuccessCount === 0) {
      // Rollback uploads and delete event
      for (const key of uploadedKeys) {
        try {
          await deleteFromR2(key);
        } catch (deleteError) {
          console.error('Rollback delete failed:', deleteError);
        }
      }
      await Event.findByIdAndDelete(event._id);
      res.status(500).json({
        message: "Event creation failed due to host registration error",
      });
      return;
    }

    res.status(201).json({
      message: "Event created successfully",
      event: {
        id: event._id,
        title: event.title,
        description: event.description,
        category: event.category,
        eventType: event.eventType,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        organizer: event.organizer,
        eligibility: event.eligibility,
        registrationUrl: event.registrationUrl,
        isOnline: event.isOnline,
        visibility: event.visibility,
        attachments: event.attachments,
        hosts: event.hosts,
        createdBy: event.createdBy,
        createdAt: event.createdAt,
      },
    });

  } catch (error) {
    console.error(error);
    // Rollback uploads on error
    for (const key of uploadedKeys) {
      try {
        await deleteFromR2(key);
      } catch (deleteError) {
        console.error('Rollback delete failed:', deleteError);
      }
    }
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const events = await Event.find({ isDeleted: false })
      .sort({ startDate: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Event.countDocuments({ isDeleted: false });

    const safeEvents = events.map(event => ({
      id: event._id,
      title: event.title,
      description: event.description,
      category: event.category,
      eventType: event.eventType,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      organizer: event.organizer,
      eligibility: event.eligibility,
      registrationUrl: event.registrationUrl,
      isOnline: event.isOnline,
      visibility: event.visibility,
      attachments: event.attachments,
      hosts: event.hosts,
      createdAt: event.createdAt,
    }));

    res.status(200).json({
      success: true,
      count: safeEvents.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: safeEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error instanceof Error ? error.message : error,
    });
  }
};

//export const getEventById = async (
//  req: Request,
//  res: Response,
//): Promise<void> => {
//  try {
//    const eventId = req.params.id as string;
//
//    if (!mongoose.Types.ObjectId.isValid(eventId)) {
//      res.status(400).json({
//        message: "Invalid event ID",
//      });
//      return;
//    }
//
//    const event = await Event.findOne({
//      _id: eventId,
//      isDeleted: false
//    });
//
//    if (!event) {
//      res.status(404).json({
//        message: "Event not found",
//      });
//      return;
//    }
//
//    res.status(200).json({
//      event,
//    });
//  } catch (error) {
//    console.error(error);
//    res.status(500).json({
//      message: "Internal server error",
//    });
//  }
//};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
  try {
    const eventId = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({ message: "Invalid event ID" });
      return;
    }

    const event = await Event.findOne({ _id: eventId, isDeleted: false });

    if (!event) {
      res.status(404).json({ message: "Event not found" });
      return;
    }

    //  Optionally enrich with fresh host details from User Service
    // hosts[] already has hostName from creation (denormalized)
    // but we can fetch fresh data for the detail view
    //TODO: finsih the later part 
    let hostDetails = null;
    try {
      const response = await axios.get(
        `${process.env.USER_SERVICE_URL}/api/event-hosts/${eventId}`
      );
      hostDetails = response.data;
    } catch {
      // Fall back to stored host data in MongoDB
    }

    res.status(200).json({
      event: {
        id: event._id,
        title: event.title,
        description: event.description,
        category: event.category,
        eventType: event.eventType,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        organizer: event.organizer,
        eligibility: event.eligibility,
        registrationUrl: event.registrationUrl,
        isOnline: event.isOnline,
        visibility: event.visibility,
        attachments: event.attachments,
        hosts: event.hosts,
        createdAt: event.createdAt,
      },
      hostDetails: hostDetails || event.hosts,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const uploadedKeys: string[] = []; // For rollback
  try {
    const eventId = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        message: "Invalid event ID",
      });
      return;
    }

    // Handle file uploads (replace attachments if new files provided)
    const attachmentUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      // Use existing event's primary host for key prefix
      const existingEvent = await Event.findById(eventId);
      if (!existingEvent) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      let keyPrefix = 'events';
      if (existingEvent.hosts && existingEvent.hosts.length > 0) {
        const primaryHost = existingEvent.hosts.find(h => h.isPrimary) || existingEvent.hosts[0]!;
        keyPrefix = `events/${primaryHost.hostType === 'school' ? 'School' : 'Organizations'}/${primaryHost.hostId}`;
      }

      for (const file of req.files) {
        try {
          const key = `${keyPrefix}/${Date.now()}-${file.originalname}`;
          const url = await uploadToR2(file.buffer, key, file.mimetype);
          attachmentUrls.push(url);
          uploadedKeys.push(key);
        } catch (uploadError) {
          console.error('Upload failed:', uploadError);
          // Rollback
          for (const key of uploadedKeys) {
            try {
              await deleteFromR2(key);
            } catch (deleteError) {
              console.error('Rollback delete failed:', deleteError);
            }
          }
          res.status(500).json({
            message: "File upload failed",
          });
          return;
        }
      }
    }

    const updateData = { ...req.body };
    if (attachmentUrls.length > 0) {
      updateData.attachments = attachmentUrls;
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, isDeleted: false },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      res.status(404).json({
        message: "Event not found",
      });
      // Rollback uploads
      for (const key of uploadedKeys) {
        try {
          await deleteFromR2(key);
        } catch (deleteError) {
          console.error('Rollback delete failed:', deleteError);
        }
      }
      return;
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: {
        id: updatedEvent._id,
        title: updatedEvent.title,
        description: updatedEvent.description,
        category: updatedEvent.category,
        eventType: updatedEvent.eventType,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate,
        location: updatedEvent.location,
        organizer: updatedEvent.organizer,
        eligibility: updatedEvent.eligibility,
        registrationUrl: updatedEvent.registrationUrl,
        isOnline: updatedEvent.isOnline,
        visibility: updatedEvent.visibility,
        attachments: updatedEvent.attachments,
        hosts: updatedEvent.hosts,
        updatedAt: updatedEvent.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    // Rollback uploads
    for (const key of uploadedKeys) {
      try {
        await deleteFromR2(key);
      } catch (deleteError) {
        console.error('Rollback delete failed:', deleteError);
      }
    }
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const eventId = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        message: "Invalid event ID",
      });
      return;
    }

    const event = await Event.findById(eventId);

    if (!event || event.isDeleted) {
      res.status(404).json({
        message: "Event not found",
      });
      return;
    }

    event.isDeleted = true;
    await event.save();

    try {
      await axios.delete(`${process.env.USER_SERVICE_URL}/api/event-hosts/${eventId}`);
    } catch (mappingDeleteError) {
      // Event deletion should succeed even if mapping cleanup fails.
      console.error("Failed to delete event host mappings:", mappingDeleteError);
    }

    res.status(200).json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

