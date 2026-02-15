import { Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../mongoose/eventModel.js";
import axios from 'axios';

//export const createEvent = async (
//  req: Request,
//  res: Response,
//): Promise<void> => {
//  try {
//    console.log("All headers:", req.headers);
//
//    const creatorId = req.headers["x-user-id"] as string;
//
//    const schoolId = req.headers["x-school-id"] as string;
//    const orgId = req.headers["x-organization-id"] as string;
//    console.log("creatorId:", creatorId);
//    if (!creatorId) {
//      res.status(400).json({
//        message: "x-user-id header is required",
//      });
//      return;
//    }
//
//    if (!schoolId && !orgId) {
//      res.status(400).json({
//        message: "Invalid School ID OR Organization ID",
//      });
//      return;
//    }
//
//    const {
//      title,
//      description,
//      category,
//      eventType,
//      startDate,
//      endDate,
//      location,
//      organizer,
//      eligibility,
//      registrationUrl,
//      isOnline,
//      visibility,
//    } = req.body;
//
//    if (
//      !title ||
//      !description ||
//      !(schoolId && orgId) ||
//      !category ||
//      !eventType ||
//      !startDate ||
//      !endDate ||
//      !location ||
//      !organizer ||
//      !eligibility
//    ) {
//      res.status(400).json({
//        message: "Missing required event fields",
//      });
//      return;
//    }
//
//    if (new Date(startDate) > new Date(endDate)) {
//      res.status(400).json({
//        message: "Start date cannot be after end date",
//      });
//      return;
//    }
//
//    const event = await Event.create({
//      title,
//      description,
//      category,
//      eventType,
//      startDate,
//      endDate,
//      location,
//      organizer,
//      eligibility,
//      registrationUrl,
//      isOnline,
//      visibility,
//      createdBy: creatorId,
//    });
//
//    res.status(201).json({
//      message: "Event created successfully",
//      event,
//    });
//  } catch (error) {
//    console.error(error);
//    res.status(500).json({
//      message: "Internal server error",
//    });
//  }
//};


//HELPER FUNCTION
//common use case would be user sees an event and user sees details and click on the event hosts like school or organization to see details 
async function fetchHostDetails(hostId: string, hostType: string) {
  try {
    const endpoint = hostType === "school"
      ? `${process.env.USER_SERVICE_URL}/api/schools/${hostId}`
      : `${process.env.USER_SERVICE_URL}/api/organizations/${hostId}`;

    const response = await axios.get(endpoint);
    return response.data;
  } catch {
    return null; // Don't fail if User Service is slow
  }
}


export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const creatorId = req.headers["x-user-uid"] as string;    // Firebase UID ✅
    const schoolId = req.headers["x-school-id"] as string;
    const orgId = req.headers["x-organization-id"] as string; // methana school id and organization id wenama ganne nathuwa creator id ek map karamud

    

    const {
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


    const event = await Event.create({
      title,
      description,
      category,
      eventType,
      startDate : start,
      endDate: end,
      location,
      organizer,
      eligibility,
      registrationUrl,
      isOnline,
      visibility,
      createdBy: creatorId,
      hosts: hosts || [],
    });

    let hostMappingSuccessCount = 0;

    // This is the event host mapping step
    if (hosts && hosts.length > 1) {
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
      await Event.findByIdAndDelete(event._id);
      res.status(500).json({
        message: "Event creation failed due to host registration error",
      });
      return;
    }

    res.status(201).json({
      message: "Event created successfully",
      event,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const events = await Event.find({ isDeleted: false })
      .sort({ startDate: 1 })
    //.populate("createdBy", "name email"); because this gives error since it cannot find User

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
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
      event,
      hostDetails: hostDetails || event.hosts, // Use fresh or stored
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
  try {
    const eventId = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      res.status(400).json({
        message: "Invalid event ID",
      });
      return;
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, isDeleted: false },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      res.status(404).json({
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    console.error(error);
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

// RSVP stands for "Répondez s'il vous plaît" (Please Respond)
// To handle student registration for an event
export const rsvpToEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  // Current Event model does not support attendees list.
  // This feature requires schema update or separate RSVP model.
  res.status(501).json({ message: "RSVP feature not implemented yet (requires model update)" });
};
