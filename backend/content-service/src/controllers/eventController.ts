import { Request, Response } from "express";
import mongoose from "mongoose";
import Event from "../mongoose/eventModel.js";

export const createEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const creatorId = req.headers["x-user-id"] as string;

    if (!creatorId) {
      res.status(400).json({
        message: "x-user-id header is required",
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(creatorId)) {
      res.status(400).json({
        message: "Invalid creator ID",
      });
      return;
    }

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
    } = req.body;

    if (
      !title ||
      !description ||
      !category ||
      !eventType ||
      !startDate ||
      !endDate ||
      !location ||
      !organizer ||
      !eligibility
    ) {
      res.status(400).json({
        message: "Missing required event fields",
      });
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      res.status(400).json({
        message: "Start date cannot be after end date",
      });
      return;
    }

    const event = await Event.create({
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
      createdBy: creatorId,
    });

    res.status(201).json({
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};


export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const events = await Event.find()
      .sort({ startDate: 1 })
      .populate("createdBy", "name email");

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

export const getEventById = async (
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

    if (!event) {
      res.status(404).json({
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      event,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
    });
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

    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
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