import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { UserType } from '@prisma/client';

//prisma mock
jest.unstable_mockModule('../../src/prisma.js', () => ({
  prisma: {
    school: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    student: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    teacher: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    admin: {
      count: jest.fn(),
    },
    skill: {
      count: jest.fn(),
    },
  },
}));

// Mock userController dependency (createUser)
jest.unstable_mockModule('../../src/controllers/userController.js', () => ({
  createUser: jest.fn(),
}));

// --- 2. DYNAMIC IMPORTS ---
const { prisma } = await import('../../src/prisma.js');
const { createUser } = await import('../../src/controllers/userController.js');
const {
  createSchool,
  listSchools,
  getSchoolById,
  updateSchool,
  getSchoolStudents,
  getSchoolTeachers,
  getSchoolStatistics
} = await import('../../src/controllers/schoolController.js');

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

describe('School Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- createSchool ---
  describe('createSchool', () => {
    it('should create school and admin user successfully', async () => {
      const req = mockRequest({
        school: { name: 'High School', address: '123 St', district: 'D1' },
        admin: { uid: 'admin1', email: 'admin@school.com' }
      });
      const res = mockResponse();

      const createdSchoolMock = { school_id: 's1', name: 'High School' };
      (prisma.school.create as jest.Mock).mockResolvedValue(createdSchoolMock);
      (createUser as jest.Mock).mockResolvedValue(undefined);

      await createSchool(req, res);

      expect(prisma.school.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ name: 'High School' })
      });
      // Check if createUser was called with correct adminReq
      expect(createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            uid: 'admin1',
            userType: UserType.SCHOOL_ADMIN,
            school_id: 's1'
          })
        }),
        expect.anything() // Response object
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if school or admin data is missing', async () => {
      const req = mockRequest({ school: { name: 'Test' } }); // MISSING THE ADMIN
      const res = mockResponse();

      await createSchool(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(prisma.school.create).not.toHaveBeenCalled();
    });
  });

  //listing schools
  describe('listSchools', () => {
    it('should return list of schools', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const mockSchools = [{ name: 'School A' }, { name: 'School B' }];

      (prisma.school.findMany as jest.Mock).mockResolvedValue(mockSchools);

      await listSchools(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalSchools: 2,
        schools: mockSchools
      });
    });
  });

  // --- getSchoolById ---
  describe('getSchoolById', () => {
    it('should return school details if found', async () => {
      const req = mockRequest({}, { id: 's1' });
      const res = mockResponse();
      (prisma.school.findUnique as jest.Mock).mockResolvedValue({ school_id: 's1' });

      await getSchoolById(req, res);

      expect(prisma.school.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { school_id: 's1' } }));
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if school not found', async () => {
      const req = mockRequest({}, { id: 's1' });
      const res = mockResponse();
      (prisma.school.findUnique as jest.Mock).mockResolvedValue(null);

      await getSchoolById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if id is missing', async () => {
      const req = mockRequest();
      const res = mockResponse();
      await getSchoolById(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // --- updateSchool ---
  describe('updateSchool', () => {
    it('should update school successfully', async () => {
      const req = mockRequest(
        { name: 'New Name' },
        { id: 's1' }
      );
      const res = mockResponse();

      (prisma.school.update as jest.Mock).mockResolvedValue({ school_id: 's1', name: 'New Name' });

      await updateSchool(req, res);

      expect(prisma.school.update).toHaveBeenCalledWith({
        where: { school_id: 's1' },
        data: expect.objectContaining({ name: 'New Name' })
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // --- getSchoolStudents ---
  describe('getSchoolStudents', () => {
    it('should return students for a school', async () => {
      const req = mockRequest({}, { id: 's1' });
      const res = mockResponse();
      const mockStudents = [{ uid: 'u1', name: 'Student 1' }];

      (prisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);

      await getSchoolStudents(req, res);

      expect(prisma.student.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { school_id: 's1' } }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ totalStudents: 1 }));
    });
  });

  // --- getSchoolTeachers ---
  describe('getSchoolTeachers', () => {
    it('should return teachers for a school', async () => {
      const req = mockRequest({}, { id: 's1' });
      const res = mockResponse();
      const mockTeachers = [{ uid: 't1', name: 'Teacher 1' }];

      (prisma.teacher.findMany as jest.Mock).mockResolvedValue(mockTeachers);

      await getSchoolTeachers(req, res);

      expect(prisma.teacher.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { school_id: 's1' } }));
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // --- getSchoolStatistics ---
  describe('getSchoolStatistics', () => {
    it('should aggregate counts correctly', async () => {
      const req = mockRequest({}, { id: 's1' });
      const res = mockResponse();

      (prisma.student.count as jest.Mock).mockResolvedValue(100);
      (prisma.teacher.count as jest.Mock).mockResolvedValue(10);
      (prisma.admin.count as jest.Mock).mockResolvedValue(2);
      (prisma.skill.count as jest.Mock).mockResolvedValue(50);

      await getSchoolStatistics(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        schoolId: 's1',
        statistics: {
          students: 100,
          teachers: 10,
          admins: 2,
          skills: 50
        }
      });
    });
  });

});
