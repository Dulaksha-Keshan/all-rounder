// tests/unit/userController.test.ts
import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';
import { UserType } from '@prisma/client';

// --- 1. DEFINE MOCKS FIRST (using unstable_mockModule) ---

// Mock Prisma
// We define the mock factory BEFORE importing the actual module
jest.unstable_mockModule('../../src/prisma.js', () => ({
  prisma: {
    student: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    teacher: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    admin: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock Mongoose Verification Model
jest.unstable_mockModule('../../src/mongoose/verificationModel.js', () => ({
  default: {
    create: jest.fn(),
  },
}));

// --- 2. IMPORT MODULES DYNAMICALLY ---
// We use 'await import' to ensure the mocks are applied before the controller loads.
const { prisma } = await import('../../src/prisma.js');
const Verification = (await import('../../src/mongoose/verificationModel.js')).default;
const {
  createUser,
  getUserById,
  getUserByFirebaseUID,
  updateUser,
  softDeleteUser
} = await import('../../src/controllers/userController.js');

// --- 3. HELPER FUNCTIONS ---

const mockRequest = (body = {}, headers = {}, params = {}) => {
  return {
    body,
    headers,
    params,
  } as unknown as Request;
};

const mockResponse = () => {
  const res = {} as Response;
  // @ts-ignore
  res.status = jest.fn().mockReturnValue(res);
  // @ts-ignore
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// --- 4. THE TESTS ---

describe('User Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- createUser Tests ---
  describe('createUser', () => {
    it('should create a Student with DOCUMENT verification', async () => {
      const req = mockRequest({
        uid: 'student123',
        userType: UserType.STUDENT,
        verificationOption: 'DOCUMENT',
        email: 'test@test.com'
      });
      const res = mockResponse();

      // Setup the mock return value
      (prisma.student.create as jest.Mock).mockResolvedValue({ uid: 'student123' });

      await createUser(req, res);

      expect(prisma.student.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ uid: 'student123' })
      });

      // Verification model check
      expect(Verification.create).toHaveBeenCalledWith(expect.objectContaining({
        userType: 'STUDENT',
        verificationMethod: 'DOCUMENT_AI'
      }));

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if uid or userType is missing', async () => {
      const req = mockRequest({ uid: '' });
      const res = mockResponse();

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(prisma.student.create).not.toHaveBeenCalled();
    });

    it('should fail if Teacher requests TEACHER_REQUEST', async () => {
      const req = mockRequest({
        uid: 'teacher123',
        userType: UserType.TEACHER,
        verificationOption: 'TEACHER_REQUEST',
        school_id: 'school1'
      });
      const res = mockResponse();

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // --- getUserById Tests ---
  describe('getUserById', () => {
    it('should fetch a Student by header UID', async () => {
      const req = mockRequest({}, { 'x-user-uid': '123', 'x-user-type': UserType.STUDENT });
      const res = mockResponse();

      (prisma.student.findUnique as jest.Mock).mockResolvedValue({ uid: '123', name: 'John' });

      await getUserById(req, res);

      expect(prisma.student.findUnique).toHaveBeenCalledWith({ where: { uid: '123' } });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ userType: UserType.STUDENT }));
    });

    it('should return 400 if headers are missing', async () => {
      const req = mockRequest({}, {});
      const res = mockResponse();

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      const req = mockRequest({}, { 'x-user-uid': '999', 'x-user-type': UserType.TEACHER });
      const res = mockResponse();

      (prisma.teacher.findUnique as jest.Mock).mockResolvedValue(null);

      await getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  // --- getUserByFirebaseUID Tests ---
  describe('getUserByFirebaseUID', () => {
    it('should find a student and freeze account if age >= 19', async () => {
      const req = mockRequest({}, {}, { uid: 'old_student' });
      const res = mockResponse();

      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 20);

      (prisma.student.findUnique as jest.Mock).mockResolvedValue({
        uid: 'old_student',
        date_of_birth: oldDate,
        is_frozen: false,
        is_active: true
      });
      // Mock update specifically for the freeze logic
      (prisma.student.update as jest.Mock).mockResolvedValue({});

      await getUserByFirebaseUID(req, res);

      expect(prisma.student.update).toHaveBeenCalledWith(expect.objectContaining({
        data: { is_frozen: true }
      }));
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ userType: UserType.STUDENT }));
    });

    it('should check Teacher table if Student not found', async () => {
      const req = mockRequest({}, {}, { uid: 'teach1' });
      const res = mockResponse();

      (prisma.student.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.teacher.findUnique as jest.Mock).mockResolvedValue({ uid: 'teach1' });

      await getUserByFirebaseUID(req, res);

      expect(prisma.student.findUnique).toHaveBeenCalled();
      expect(prisma.teacher.findUnique).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ userType: UserType.TEACHER }));
    });
  });

  // --- updateUser Tests ---
  describe('updateUser', () => {
    it('should block update if student is frozen (over 19)', async () => {
      const req = mockRequest(
        { name: 'New Name' },
        { 'x-user-uid': 'frozen_guy', 'x-user-type': UserType.STUDENT }
      );
      const res = mockResponse();

      const oldDate = new Date();
      oldDate.setFullYear(oldDate.getFullYear() - 20);

      (prisma.student.findUnique as jest.Mock).mockResolvedValue({
        uid: 'frozen_guy',
        date_of_birth: oldDate,
        is_frozen: true
      });

      await updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      // Ensure update was NOT called with the new name
      expect(prisma.student.update).not.toHaveBeenCalledWith(expect.objectContaining({
        data: { name: 'New Name' }
      }));
    });

    it('should update teacher successfully', async () => {
      const req = mockRequest(
        { bio: 'Updated Bio' },
        { 'x-user-uid': 'teach1', 'x-user-type': UserType.TEACHER }
      );
      const res = mockResponse();

      (prisma.teacher.update as jest.Mock).mockResolvedValue({ uid: 'teach1', bio: 'Updated Bio' });

      await updateUser(req, res);

      expect(prisma.teacher.update).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  // --- softDeleteUser Tests ---
  describe('softDeleteUser', () => {
    it('should soft delete an admin', async () => {
      const req = mockRequest(
        {},
        { 'x-user-uid': 'admin1', 'x-user-type': UserType.ORG_ADMIN }
      );
      const res = mockResponse();

      (prisma.admin.update as jest.Mock).mockResolvedValue({ uid: 'admin1', is_active: false });

      await softDeleteUser(req, res);

      expect(prisma.admin.update).toHaveBeenCalledWith({
        where: { uid: 'admin1' },
        data: { is_active: false }
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
