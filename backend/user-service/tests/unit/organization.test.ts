import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { Request, Response } from 'express';


// mocking prisma 
jest.unstable_mockModule('../../src/prisma.js', () => ({
  prisma: {
    organization: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    admin: {
      findUnique: jest.fn(),
    },
  },
}));

// Mock userController dependency (createUser)
jest.unstable_mockModule('../../src/controllers/userController.js', () => ({
  createUser: jest.fn(),
}));


// importing testable modules
const { prisma } = await import('../../src/prisma.js');
const { createUser } = await import('../../src/controllers/userController.js');
const {
  listOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization
} = await import('../../src/controllers/organizationController.js');

// request and res mimicking 
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

describe('Organization Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // listOrganizations
  describe('listOrganizations', () => {
    it('should return a list of organizations', async () => {
      const req = mockRequest();
      const res = mockResponse();
      const mockOrgs = [{ organization_id: 'org1', organization_name: 'Org A' }];

      (prisma.organization.findMany as jest.Mock).mockResolvedValue(mockOrgs);

      await listOrganizations(req, res);

      expect(prisma.organization.findMany).toHaveBeenCalledWith(expect.objectContaining({
        orderBy: { created_at: 'desc' }
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        count: 1,
        organizations: mockOrgs
      });
    });
  });

  // get an organization with id
  describe('getOrganizationById', () => {
    it('should return organization details with admins', async () => {
      const req = mockRequest({}, { id: 'org1' });
      const res = mockResponse();
      const mockOrg = {
        organization_id: 'org1',
        organization_name: 'Org A',
        admins: [{ uid: 'admin1', name: 'Admin A' }]
      };

      (prisma.organization.findUnique as jest.Mock).mockResolvedValue(mockOrg);

      await getOrganizationById(req, res);

      expect(prisma.organization.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { organization_id: 'org1' },
        include: { admins: expect.anything() }
      }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ organization: mockOrg }));
    });

    it('should return 404 if organization not found', async () => {
      const req = mockRequest({}, { id: 'org99' });
      const res = mockResponse();

      (prisma.organization.findUnique as jest.Mock).mockResolvedValue(null);

      await getOrganizationById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 if ID is missing', async () => {
      const req = mockRequest(); // No params
      const res = mockResponse();

      await getOrganizationById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  // create an organization
  describe('createOrganization', () => {
    it('should create organization and admin user', async () => {
      const req = mockRequest({
        organization_name: 'New Org',
        contact_person: 'John Doe',
        admin: { email: 'admin@org.com', password: '123' }
      });
      const res = mockResponse();

      const createdOrg = { organization_id: 'org1', organization_name: 'New Org' };
      (prisma.organization.create as jest.Mock).mockResolvedValue(createdOrg);
      (createUser as jest.Mock).mockResolvedValue(undefined);

      await createOrganization(req, res);

      expect(prisma.organization.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ organization_name: 'New Org' })
      });

      // Verify createUser was called with correct constructed request
      expect(createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            organization_id: 'org1',
            userType: 'ORG_ADMIN',
            verificationOption: 'DOCUMENT'
          })
        }),
        expect.anything() // Response mock
      );

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if required fields are missing', async () => {
      const req = mockRequest({ organization_name: 'New Org' }); // Missing contact & admin
      const res = mockResponse();

      await createOrganization(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(prisma.organization.create).not.toHaveBeenCalled();
    });
  });

  //updating an organization
  describe('updateOrganization', () => {
    it('should update organization if admin is authorized', async () => {
      const req = mockRequest(
        { adminId: 'admin1', organization_name: 'Updated Name' },
        { id: 'org1' }
      );
      const res = mockResponse();

      // Mock Admin check Correct Type and Correct Org ID
      (prisma.admin.findUnique as jest.Mock).mockResolvedValue({
        uid: 'admin1',
        adminType: 'ORG_ADMIN',
        organization_id: 'org1'
      });

      (prisma.organization.update as jest.Mock).mockResolvedValue({
        organization_id: 'org1',
        organization_name: 'Updated Name'
      });

      await updateOrganization(req, res);

      expect(prisma.organization.update).toHaveBeenCalledWith({
        where: { organization_id: 'org1' },
        data: { organization_name: 'Updated Name' } // adminId is stripped
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 403 if adminId is missing', async () => {
      const req = mockRequest({ organization_name: 'Update' }, { id: 'org1' }); // missing admins
      const res = mockResponse();

      await updateOrganization(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 403 if admin is unauthorized (wrong org)', async () => {
      const req = mockRequest(
        { adminId: 'admin1', organization_name: 'Update' },
        { id: 'org1' }
      );
      const res = mockResponse();

      // Mock Admin belonging to DIFFERENT org
      (prisma.admin.findUnique as jest.Mock).mockResolvedValue({
        uid: 'admin1',
        adminType: 'ORG_ADMIN',
        organization_id: 'org999' // Different ID
      });

      await updateOrganization(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: "Unauthorized to update this organization" }));
      expect(prisma.organization.update).not.toHaveBeenCalled();
    });

    it('should return 400 if org ID is missing', async () => {
      const req = mockRequest({ adminId: '1' }, {}); // No params
      const res = mockResponse();
      await updateOrganization(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
