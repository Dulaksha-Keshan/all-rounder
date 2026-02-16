import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { UserType } from '@prisma/client';


// We need to handle Mongoose chaining (find().sort())
const mockSort = jest.fn();
const mockFind = jest.fn().mockReturnValue({ sort: mockSort });

jest.unstable_mockModule('../../src/mongoose/clubModel.js', () => ({
  default: {
    find: mockFind,
    findById: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

// Import the mocked model to control behavior in tests
const Club = (await import('../../src/mongoose/clubModel.js')).default;

// Import the controller functions
const {
  getAllClubs,
  getAllClubsForAdmins,
  getClubById,
  createClub,
  updateClub,
  deleteClub
} = await import('../../src/controllers/clubController.js');

// mocking request and responses  objects
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
    // Reset the chainable mock return
    mockFind.mockReturnValue({ sort: mockSort });
  });

  // --- getAllClubs ---
  describe('getAllClubs', () => {
    it('should fetch clubs for a specific school', async () => {
      const req = mockRequest({}, { 'x-school-id': 'school1' });
      const res = mockResponse();
      const mockClubs = [{ name: 'Chess Club' }];

      mockSort.mockResolvedValue(mockClubs); // The final result after sort()

      await getAllClubs(req, res);

      expect(Club.find).toHaveBeenCalledWith({ schoolId: 'school1' });
      expect(mockSort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ clubs: mockClubs }));
    });

    it('should return 400 if school ID header is missing', async () => {
      const req = mockRequest({}, {}); // No headers
      const res = mockResponse();

      await getAllClubs(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(Club.find).not.toHaveBeenCalled();
    });
  });

  // --- getAllClubsForAdmins ---
  describe('getAllClubsForAdmins', () => {
    it('should fetch all clubs for SUPER_ADMIN', async () => {
      const req = mockRequest({}, { 'x-user-type': UserType.SUPER_ADMIN });
      const res = mockResponse();
      const mockClubs = [{ name: 'All Clubs' }];

      mockSort.mockResolvedValue(mockClubs);

      await getAllClubsForAdmins(req, res);

      expect(Club.find).toHaveBeenCalledWith(); // Called without args
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 401 if user is not SUPER_ADMIN', async () => {
      const req = mockRequest({}, { 'x-user-type': UserType.STUDENT });
      const res = mockResponse();

      await getAllClubsForAdmins(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(Club.find).not.toHaveBeenCalled();
    });
  });

  // --- getClubById ---
  describe('getClubById', () => {
    it('should return club if it exists and matches school', async () => {
      const req = mockRequest({}, { 'x-school-id': 'school1' }, { id: 'club1' });
      const res = mockResponse();

      (Club.findById as jest.Mock).mockResolvedValue({ _id: 'club1', schoolId: 'school1', name: 'Club A' });

      await getClubById(req, res);

      expect(Club.findById).toHaveBeenCalledWith('club1');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if club ID or school ID is missing', async () => {
      const req = mockRequest({}, { 'x-school-id': 'school1' }, {}); // Missing ID param
      const res = mockResponse();
      await getClubById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if club does not exist', async () => {
      const req = mockRequest({}, { 'x-school-id': 'school1' }, { id: 'club1' });
      const res = mockResponse();
      (Club.findById as jest.Mock).mockResolvedValue(null);

      await getClubById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 404 if club belongs to a different school', async () => {
      const req = mockRequest({}, { 'x-school-id': 'school1' }, { id: 'club1' });
      const res = mockResponse();
      // Club exists but schoolId differs
      (Club.findById as jest.Mock).mockResolvedValue({ _id: 'club1', schoolId: 'OTHER_SCHOOL' });

      await getClubById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "No such a Club found in the school" }));
    });
  });

  // --- createClub ---
  describe('createClub', () => {
    it('should create a club successfully', async () => {
      const req = mockRequest({
        name: 'Science Club',
        description: 'Science stuff',
        category: 'Education',
        schoolName: 'High School',
        teacherInCharge: { name: 'Teacher A' }
      }, {
        'x-user-type': UserType.SCHOOL_ADMIN,
        'x-user-id': 'admin1'
      });
      const res = mockResponse();

      (Club.findOne as jest.Mock).mockResolvedValue(null); // No existing club
      (Club.create as jest.Mock).mockResolvedValue({ name: 'Science Club', _id: 'club1' });

      await createClub(req, res);

      expect(Club.create).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Science Club',
        createdBy: 'admin1'
      }));
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 403 if user is not an admin', async () => {
      const req = mockRequest({}, { 'x-user-type': UserType.STUDENT, 'x-user-id': 'u1' });
      const res = mockResponse();

      await createClub(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 409 if club name already exists', async () => {
      const req = mockRequest({
        name: 'Science Club',
        description: 'Desc',
        category: 'Cat',
        schoolName: 'School',
        teacherInCharge: { name: 'T' }
      }, {
        'x-user-type': UserType.SCHOOL_ADMIN,
        'x-user-id': 'admin1'
      });
      const res = mockResponse();

      (Club.findOne as jest.Mock).mockResolvedValue({ name: 'Science Club' }); // Exists

      await createClub(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(Club.create).not.toHaveBeenCalled();
    });

    it('should return 400 if required fields are missing', async () => {
      const req = mockRequest({ name: 'Only Name' }, {
        'x-user-type': UserType.SCHOOL_ADMIN,
        'x-user-id': 'admin1'
      });
      const res = mockResponse();

      await createClub(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // --- updateClub ---
  describe('updateClub', () => {
    it('should update club successfully', async () => {
      const req = mockRequest(
        { name: 'Updated Name' },
        { 'x-school-id': 'school1' },
        { id: 'club1' }
      );
      const res = mockResponse();

      (Club.findByIdAndUpdate as jest.Mock).mockResolvedValue({ _id: 'club1', name: 'Updated Name' });

      await updateClub(req, res);

      expect(Club.findByIdAndUpdate).toHaveBeenCalledWith('club1', expect.objectContaining({ name: 'Updated Name' }), expect.anything());
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if school ID or Club ID is missing', async () => {
      const req = mockRequest({}, {}, { id: 'club1' }); // Missing School ID header
      const res = mockResponse();

      await updateClub(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if club not found', async () => {
      const req = mockRequest({}, { 'x-school-id': 'school1' }, { id: 'club1' });
      const res = mockResponse();

      (Club.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      await updateClub(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // --- deleteClub ---
  describe('deleteClub', () => {
    it('should delete club successfully', async () => {
      const req = mockRequest({}, {}, { id: 'club1' });
      const res = mockResponse();

      (Club.findByIdAndDelete as jest.Mock).mockResolvedValue({ _id: 'club1' });

      await deleteClub(req, res);

      expect(Club.findByIdAndDelete).toHaveBeenCalledWith('club1');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if club not found', async () => {
      const req = mockRequest({}, {}, { id: 'club1' });
      const res = mockResponse();

      (Club.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      await deleteClub(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
