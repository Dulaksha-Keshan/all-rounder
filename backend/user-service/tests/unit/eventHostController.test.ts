import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';

// --- 1. DEFINE MOCKS FIRST ---

// Mock Prisma
jest.unstable_mockModule('../../src/prisma.js', () => ({
  prisma: {
    eventHost: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

// --- 2. DYNAMIC IMPORTS ---
const { prisma } = await import('../../src/prisma.js');
const {
  createEventHost,
  getEventHosts,
  getSchoolEventIds,
  getOrganizationEventIds,
  deleteEventHosts
} = await import('../../src/controllers/eventHostController.js');

// --- 3. HELPERS ---
const mockRequest = (body = {}, params = {}, query = {}) => {
  return { body, params, query } as unknown as Request;
};

const mockResponse = () => {
  const res = {} as Response;
  // @ts-ignore
  res.status = jest.fn().mockReturnValue(res);
  // @ts-ignore
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Event Host Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- createEventHost ---
  describe('createEventHost', () => {
    it('should create an event host mapping successfully', async () => {
      const req = mockRequest({
        eventId: 'evt1',
        hostType: 'SCHOOL',
        schoolId: 'sch1',
        isPrimaryHost: true
      });
      const res = mockResponse();

      const mockCreatedHost = { id: 1, eventId: 'evt1', schoolId: 'sch1' };
      (prisma.eventHost.create as jest.Mock).mockResolvedValue(mockCreatedHost);

      await createEventHost(req, res);

      expect(prisma.eventHost.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          eventId: 'evt1',
          hostType: 'SCHOOL',
          schoolId: 'sch1',
          organizationId: null, // Should default to null if undefined
          isPrimaryHost: true
        })
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedHost);
    });

    it('should return 400 if eventId or hostType is missing', async () => {
      const req = mockRequest({ schoolId: 'sch1' }); // Missing eventId & hostType
      const res = mockResponse();

      await createEventHost(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(prisma.eventHost.create).not.toHaveBeenCalled();
    });

    it('should return 409 if mapping already exists (Prisma P2002)', async () => {
      const req = mockRequest({ eventId: 'evt1', hostType: 'SCHOOL' });
      const res = mockResponse();

      const error = new Error("Unique constraint failed") as any;
      error.code = 'P2002';

      (prisma.eventHost.create as jest.Mock).mockRejectedValue(error);

      await createEventHost(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Host mapping already exists" }));
    });

    it('should return 500 for generic database errors', async () => {
      const req = mockRequest({ eventId: 'evt1', hostType: 'SCHOOL' });
      const res = mockResponse();

      (prisma.eventHost.create as jest.Mock).mockRejectedValue(new Error("DB Error"));

      await createEventHost(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // --- getEventHosts ---
  describe('getEventHosts', () => {
    it('should fetch all hosts for a specific event', async () => {
      const req = mockRequest({}, { eventId: 'evt1' });
      const res = mockResponse();

      const mockHosts = [
        { school: { name: 'School A' }, organization: null },
        { school: null, organization: { organization_name: 'Org B' } }
      ];

      (prisma.eventHost.findMany as jest.Mock).mockResolvedValue(mockHosts);

      await getEventHosts(req, res);

      expect(prisma.eventHost.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { eventId: 'evt1' },
        include: {
          school: expect.anything(),
          organization: expect.anything()
        }
      }));
      expect(res.json).toHaveBeenCalledWith(mockHosts);
    });

    it('should return 500 on database error', async () => {
      const req = mockRequest({}, { eventId: 'evt1' });
      const res = mockResponse();
      (prisma.eventHost.findMany as jest.Mock).mockRejectedValue(new Error("Fail"));

      await getEventHosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // --- getSchoolEventIds ---
  describe('getSchoolEventIds', () => {
    it('should return a list of event IDs for a school', async () => {
      const req = mockRequest({}, { schoolId: 'sch1' });
      const res = mockResponse();

      // Mock DB returning complex objects
      const mockDbResponse = [
        { eventId: 'evt1', isPrimaryHost: true },
        { eventId: 'evt2', isPrimaryHost: false }
      ];

      (prisma.eventHost.findMany as jest.Mock).mockResolvedValue(mockDbResponse);

      await getSchoolEventIds(req, res);

      expect(prisma.eventHost.findMany).toHaveBeenCalledWith({
        where: { schoolId: 'sch1' },
        select: { eventId: true, isPrimaryHost: true },
        orderBy: { createdAt: "desc" },
      });

      // Assert the transformation (mapping to IDs only)
      expect(res.json).toHaveBeenCalledWith({
        eventIds: ['evt1', 'evt2'],
        total: 2
      });
    });

    it('should return empty list if school has no events', async () => {
      const req = mockRequest({}, { schoolId: 'sch1' });
      const res = mockResponse();

      (prisma.eventHost.findMany as jest.Mock).mockResolvedValue([]);

      await getSchoolEventIds(req, res);

      expect(res.json).toHaveBeenCalledWith({
        eventIds: [],
        total: 0
      });
    });

    it('should return 500 on error', async () => {
      const req = mockRequest({}, { schoolId: 'sch1' });
      const res = mockResponse();
      (prisma.eventHost.findMany as jest.Mock).mockRejectedValue(new Error("Fail"));

      await getSchoolEventIds(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // --- getOrganizationEventIds ---
  describe('getOrganizationEventIds', () => {
    it('should return a list of event IDs for an organization', async () => {
      const req = mockRequest({}, { orgId: 'org1' });
      const res = mockResponse();

      const mockDbResponse = [{ eventId: 'evt5', isPrimaryHost: true }];
      (prisma.eventHost.findMany as jest.Mock).mockResolvedValue(mockDbResponse);

      await getOrganizationEventIds(req, res);

      expect(prisma.eventHost.findMany).toHaveBeenCalledWith({
        where: { organizationId: 'org1' },
        select: { eventId: true, isPrimaryHost: true },
        orderBy: { createdAt: "desc" },
      });

      expect(res.json).toHaveBeenCalledWith({
        eventIds: ['evt5'],
        total: 1
      });
    });

    it('should return 500 on error', async () => {
      const req = mockRequest({}, { orgId: 'org1' });
      const res = mockResponse();
      (prisma.eventHost.findMany as jest.Mock).mockRejectedValue(new Error("Fail"));

      await getOrganizationEventIds(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // --- deleteEventHosts ---
  describe('deleteEventHosts', () => {
    it('should delete all mappings for an event ID', async () => {
      const req = mockRequest({}, { eventId: 'evt1' });
      const res = mockResponse();

      (prisma.eventHost.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });

      await deleteEventHosts(req, res);

      expect(prisma.eventHost.deleteMany).toHaveBeenCalledWith({
        where: { eventId: 'evt1' }
      });
      expect(res.json).toHaveBeenCalledWith({ message: "Event host mappings deleted" });
    });

    it('should return 500 on error', async () => {
      const req = mockRequest({}, { eventId: 'evt1' });
      const res = mockResponse();
      (prisma.eventHost.deleteMany as jest.Mock).mockRejectedValue(new Error("Fail"));

      await deleteEventHosts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
