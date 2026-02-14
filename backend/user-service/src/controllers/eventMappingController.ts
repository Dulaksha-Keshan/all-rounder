import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Create host mapping (called by Content Service)
export const createEventHost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId, hostType, schoolId, organizationId, isPrimaryHost } = req.body;

    if (!eventId || !hostType) {
      res.status(400).json({ message: "eventId and hostType are required" });
      return;
    }

    const eventHost = await prisma.eventHost.create({
      data: {
        eventId,
        hostType,
        schoolId: schoolId || null,
        organizationId: organizationId || null,
        isPrimaryHost: isPrimaryHost || false,
      },
    });

    res.status(201).json(eventHost);
  } catch (error: any) {
    // Handle duplicate mapping gracefully
    if (error.code === "P2002") {
      res.status(409).json({ message: "Host mapping already exists" });
      return;
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all hosts for an event (called by Content Service)
export const getEventHosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    const hosts = await prisma.eventHost.findMany({
      where: { eventId },
      include: {
        school: {
          select: { id: true, name: true }
        },
        organization: {
          select: { id: true, name: true }
        },
      },
    });

    res.json(hosts);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all events for a school (returns eventIds for Content Service to fetch)
export const getSchoolEventIds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { schoolId } = req.params;

    const eventHosts = await prisma.eventHost.findMany({
      where: { schoolId },
      select: { eventId: true, isPrimaryHost: true },
      orderBy: { createdAt: "desc" },
    });

    // Return just the IDs - Content Service will fetch full event data
    const eventIds = eventHosts.map(eh => eh.eventId);

    res.json({ eventIds, total: eventIds.length });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all events for an organization
export const getOrganizationEventIds = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orgId } = req.params;

    const eventHosts = await prisma.eventHost.findMany({
      where: { organizationId: orgId },
      select: { eventId: true, isPrimaryHost: true },
      orderBy: { createdAt: "desc" },
    });

    const eventIds = eventHosts.map(eh => eh.eventId);

    res.json({ eventIds, total: eventIds.length });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete host mappings when event is deleted
export const deleteEventHosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    await prisma.eventHost.deleteMany({
      where: { eventId },
    });

    res.json({ message: "Event host mappings deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
