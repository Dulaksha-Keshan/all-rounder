import { Request, Response } from "express";

// To create an event
export const createEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {};

// To populate the main feed
export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {};

// When someone clicks an event card
export const getEventDetails = async (
  req: Request,
  res: Response,
): Promise<void> => {};

// RSVP stands for "Répondez s'il vous plaît" (Please Respond)
// To handle student registration for an event
export const rsvpToEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {};
