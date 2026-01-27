import { Request, Response } from "express";

export const createEvent = (req: Request, res: Response): void => {};

export const getAllEvents = (req: Request, res: Response): void => {};

export const getEventById = (req: Request, res: Response): void => {};

export const updateEvent = (req: Request, res: Response): void => {};

export const deleteEvent = (req: Request, res: Response): void => {};


// RSVP stands for "Répondez s'il vous plaît" (Please Respond)
// To handle student registration for an event
export const rsvpToEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {};
