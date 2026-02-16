import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { UserType } from '@prisma/client';


// mimicking prisma 
jest.unstable_mockModule('../../src/prisma.js', () => ({
  prisma: {
    student: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    teacher: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

// mocking mongoose functions
const mockSave = jest.fn();
const mockMembersPush = jest.fn();
const mockMembersPull = jest.fn();

// Helper to create a data record that behaves like a Mongoose Document
const createMockClubDoc = (data: any) => ({
  ...data,
  isDeleted: data.isDeleted || false,
  members: {
    ...data.members || [],
    // Attach Mongoose-specific array methods
    push: mockMembersPush,
    pull: mockMembersPull,
    some: Array.prototype.some.bind(data.members || []),
    length: (data.members || []).length,
    filter: Array.prototype.filter.bind(data.members || []),
    map: Array.prototype.map.bind(data.members || [])
  },
  save: mockSave,
});

// Chainable mock for find().sort()
const mockSort = jest.fn();
const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

jest.unstable_mockModule('../../src/mongoose/clubModel.js', () => ({
  default: {
    find: mockFind,
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

// mimick import and testable module
const { prisma } = await import('../../src/prisma.js');
const Club = (await import('../../src/mongoose/clubModel.js')).default;
const {
  getAllClubs,
  getAllClubsForAdmins,
  getClubById,
  createClub,
  deleteClub,
  joinClub,
  leaveClub,
  getMembers,
  getUserClubs
} = await import('../../src/controllers/clubController.js');

// mimicking res and req objects
const mockRequest = (body = {}, headers = {}, params = {}) => {
  return { body, headers, params } as unknown as Request;
};

const mockResponse = () => {
  const res = {} as Response;
  // @ts-ignore
  res.status = jest.fn().mockReturnValue(res);
  // @ts-ignore
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Club Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset chainable returns
    mockFind.mockReturnValue({ sort: mockSort });
    // Reset document mock implementations if needed
    mockSave.mockResolvedValue(true);
  });

  // public view of clubs fort all the clubsa for their school
  describe('getAllClubs', () => {
    it('should fetch clubs for a school', async () => {
      const req = mockRequest({}, { 'x-school-id': 'school1' });
      const res = mockResponse();
      mockSort.mockResolvedValue([{ name: 'Club A' }]);

      await getAllClubs(req, res);

      expect(Club.find).toHaveBeenCalledWith({ schoolId: 'school1' });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if school ID is missing', async () => {
      const req = mockRequest();
      const res = mockResponse();
      await getAllClubs(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // all clubs for admins just a super admin method
  describe('getAllClubsForAdmins', () => {
    it('should fetch all clubs for super admin', async () => {
      const req = mockRequest({}, { 'x-user-type': UserType.SUPER_ADMIN });
      const res = mockResponse();

      mockSort.mockResolvedValue([]);

      await getAllClubsForAdmins(req, res);

      expect(Club.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 for non-super admins', async () => {
      const req = mockRequest({}, { 'x-user-type': 'STUDENT' });
      const res = mockResponse();
      await getAllClubsForAdmins(req, res);
      expect(res.status).toHaveBeenCalledWith(401);
    });
  });

  // fetching a club by id  also limited to the users own school
  describe('getClubById', () => {
    it('should return club if school matches', async () => {
      const req = mockRequest({}, { 'x-school-id': 's1' }, { id: 'c1' });
      const res = mockResponse();

      (Club.findById as jest.Mock).mockResolvedValue({ _id: 'c1', schoolId: 's1' });

      await getClubById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if club schoolId mismatch', async () => {
      const req = mockRequest({}, { 'x-school-id': 's1' }, { id: 'c1' });
      const res = mockResponse();

      (Club.findById as jest.Mock).mockResolvedValue({ _id: 'c1', schoolId: 'DIFFERENT' });

      await getClubById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "No such a Club found in the school" }));
    });
  });

  // create a club as a school admin
  describe('createClub', () => {
    it('should create club successfully', async () => {
      const req = mockRequest({
        name: 'Math Club',
        description: 'Math',
        category: 'Edu',
        schoolName: 'S1',
        teacherInCharge: { name: 'T1' }
      }, {
        'x-user-type': UserType.SCHOOL_ADMIN,
        'x-user-id': 'admin1'
      });
      const res = mockResponse();

      (Club.findOne as jest.Mock).mockResolvedValue(null); // No dupe
      (Club.create as jest.Mock).mockResolvedValue({ name: 'Math Club' });

      await createClub(req, res);

      expect(Club.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 409 if club name exists', async () => {
      const req = mockRequest({
        name: 'Math Club',
        description: 'Math',
        category: 'Edu',
        schoolName: 'S1',
        teacherInCharge: { name: 'T1' }
      }, {
        'x-user-type': UserType.SCHOOL_ADMIN,
        'x-user-id': 'admin1'
      });
      const res = mockResponse();
      (Club.findOne as jest.Mock).mockResolvedValue({ name: 'Math Club' });

      await createClub(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  // removing a club from a school with ownership
  describe('deleteClub', () => {
    it('should soft delete club if owner requests it', async () => {
      const req = mockRequest({}, {
        'x-user-uid': 'owner1',
        'x-user-type': 'TEACHER'
      }, { id: 'c1' });
      const res = mockResponse();

      // Create a mock doc that we can save()
      const mockClub = createMockClubDoc({
        _id: 'c1',
        createdBy: 'owner1',
        isDeleted: false
      });

      (Club.findById as jest.Mock).mockResolvedValue(mockClub);

      await deleteClub(req, res);

      expect(mockClub.isDeleted).toBe(true); // Check if flag flipped
      expect(mockClub.save).toHaveBeenCalled(); // Check if saved
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should fail if unauthorized user tries to delete', async () => {
      const req = mockRequest({}, {
        'x-user-uid': 'imposter',
        'x-user-type': 'TEACHER'
      }, { id: 'c1' });
      const res = mockResponse();

      const mockClub = createMockClubDoc({
        _id: 'c1',
        createdBy: 'owner1', // Different owner
        isDeleted: false
      });

      (Club.findById as jest.Mock).mockResolvedValue(mockClub);

      await deleteClub(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(mockClub.save).not.toHaveBeenCalled();
    });
  });

  // Join a club
  describe('joinClub', () => {
    it('should allow student to join club and update both DBs', async () => {
      const req = mockRequest({}, {
        'x-user-uid': 'u1',
        'x-user-type': 'STUDENT',
        'x-school-id': 's1'
      }, { id: 'c1' });
      const res = mockResponse();

      const mockClub = createMockClubDoc({
        _id: 'c1',
        schoolId: 's1',
        members: [] // Empty members
      });

      (Club.findById as jest.Mock).mockResolvedValue(mockClub);

      await joinClub(req, res);

      // Verify Mongoose Update
      expect(mockClub.members.push).toHaveBeenCalledWith(expect.objectContaining({
        uid: 'u1',
        userType: 'STUDENT'
      }));
      expect(mockClub.save).toHaveBeenCalled();

      // Verify Prisma Update
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { uid: 'u1' },
        data: { clubIds: { push: 'c1' } }
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 409 if already a member', async () => {
      const req = mockRequest({}, {
        'x-user-uid': 'u1',
        'x-user-type': 'STUDENT',
        'x-school-id': 's1'
      }, { id: 'c1' });
      const res = mockResponse();

      // Mock club with existing member
      const mockClub = createMockClubDoc({
        _id: 'c1',
        schoolId: 's1',
        members: [{ uid: 'u1' }] // User already here
      });

      (Club.findById as jest.Mock).mockResolvedValue(mockClub);

      await joinClub(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(mockClub.save).not.toHaveBeenCalled();
    });
  });

  //leave a club
  describe('leaveClub', () => {
    it('should allow user to leave and remove from both DBs', async () => {
      const req = mockRequest({}, {
        'x-user-uid': 'u1',
        'x-user-type': 'STUDENT'
      }, { id: 'c1' });
      const res = mockResponse();

      const mockClub = createMockClubDoc({
        _id: 'c1',
        members: [{ uid: 'u1' }] // Is member
      });

      (Club.findById as jest.Mock).mockResolvedValue(mockClub);

      // Mock student fetching for the array filter logic
      (prisma.student.findUnique as jest.Mock).mockResolvedValue({
        uid: 'u1',
        clubIds: ['c1', 'c2']
      });

      await leaveClub(req, res);

      // Verify Mongoose pull
      expect(mockClub.members.pull).toHaveBeenCalledWith({ uid: 'u1' });
      expect(mockClub.save).toHaveBeenCalled();

      // Verify Prisma update (filtering out c1)
      expect(prisma.student.update).toHaveBeenCalledWith({
        where: { uid: 'u1' },
        data: {
          clubIds: { set: ['c2'] } // c1 should be gone
        }
      });

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 409 if user is not a member', async () => {
      const req = mockRequest({}, {
        'x-user-uid': 'u1',
        'x-user-type': 'STUDENT'
      }, { id: 'c1' });
      const res = mockResponse();

      const mockClub = createMockClubDoc({
        _id: 'c1',
        members: [] // Empty
      });

      (Club.findById as jest.Mock).mockResolvedValue(mockClub);

      await leaveClub(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
    });
  });

  // --- getUserClubs ---
  describe('getUserClubs', () => {
    it('should fetch clubs for a student', async () => {
      const req = mockRequest({}, {
        'x-user-id': 'u1',
        'x-user-type': 'STUDENT'
      });
      const res = mockResponse();

      // 1. Prisma returns list of IDs
      (prisma.student.findUnique as jest.Mock).mockResolvedValue({
        uid: 'u1',
        clubIds: ['507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012'] // Valid ObjectIds
      });

      // 2. Mongoose finds those clubs
      const mockClubsList = [{ name: 'Club 1' }, { name: 'Club 2' }];
      (Club.find as jest.Mock).mockResolvedValue(mockClubsList);

      await getUserClubs(req, res);

      // Verify Prisma called
      expect(prisma.student.findUnique).toHaveBeenCalledWith({
        where: { uid: 'u1' },
        select: { clubIds: true }
      });

      // Verify Mongoose called with $in query
      expect(Club.find).toHaveBeenCalledWith({
        _id: { $in: expect.any(Array) },
        isDeleted: false
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 2 }));
    });

    it('should return empty list if user has no clubs', async () => {
      const req = mockRequest({}, {
        'x-user-id': 'u1',
        'x-user-type': 'TEACHER'
      });
      const res = mockResponse();

      (prisma.teacher.findUnique as jest.Mock).mockResolvedValue({
        clubIds: []
      });

      await getUserClubs(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ clubs: [] }));
      expect(Club.find).not.toHaveBeenCalled();
    });
  });

  // get members of a club
  describe('getMembers', () => {
    it('should return members list', async () => {
      const req = mockRequest({}, {}, { id: 'c1' });
      const res = mockResponse();

      const mockClub = createMockClubDoc({
        _id: 'c1',
        name: 'Club A',
        members: [{ uid: 'u1' }, { uid: 'u2' }]
      });

      (Club.findById as jest.Mock).mockResolvedValue(mockClub);

      await getMembers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        totalMembers: 2,
        clubName: 'Club A'
      }));
    });
  });

});
