import express, { Request, Response } from 'express'
import { firebaseAuth } from '../config/firebase-admin.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import axios, { responseEncoding } from 'axios'
import { error } from 'console';


const router = express.Router();


//Register with email and password

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, schoolId, organizationId } = req.body;

    if (!email || !password || !name || !role) {
      res.status(400).json({
        error: 'Missing required fields',
        message: "Required Email, Password, Role, Name"
      })
      return
    }



    //TODO:Check if the roles and enum macthes or not
    const validRoles = ['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'ORG_ADMIN'];
    if (!validRoles.includes(role)) {
      res.status(400).json({
        error: 'Invalid role',
        validRoles
      });
      return;
    }

    if ((role === 'STUDENT' || role === 'TEACHER') && !schoolId) {
      res.status(400).json({
        error: 'schoolId is required for students and teachers',
        message: 'School is Missing'
      });
      return;
    }

    const firebaseUser = await firebaseAuth.createUser(email, password, name);

    // Forward to User Service to create in PostgreSQL
    try {
      const userServiceResponse = await axios.post(
        `${process.env.USER_SERVICE_URL}/api/users`,
        {
          email,
          name,
          role,
          schoolId,
          organizationId
        }
      );

      const dbUser = userServiceResponse.data;

      // Set custom claims in Firebase
      const customClaims: any = {
        role,
        userType: role.replace("_ADMIN", "")
      };

      if (schoolId) customClaims.schoolId = schoolId;
      if (dbUser.organizationId) customClaims.organizationId = dbUser.organizationId;

      await firebaseAuth.setCustomClaims(firebaseUser.uid, customClaims);

      // Return success (user needs to login to get token)
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          role
        },
      });

    } catch (dbError: any) {


      // Rollback for Firebase user if database creation failed
      await firebaseAuth.deleteUser(firebaseUser.uid);
      throw new Error(`Failed to create user in database: ${dbError.message}`);
    }
  } catch (error: any) {

    console.error("Registration Error : ", error);

    if (error.message.includes('email-already-exists')) {
      res.status(400).json({
        error: 'Email already exists',
        message: 'This email is already registered'
      });
      return;
    }

    res.status(500).json({
      error: 'Registration failed',
      message: error.message
    });
  }
})
