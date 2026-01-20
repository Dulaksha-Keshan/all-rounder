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
          ...(schoolId && { schoolId }),
          ...(organizationId && { organizationId })
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



//TODO:GOOGLE SIGN IN
//infornt end it should be google sign in first and then after that relavant register details according to the selected the use type school..etc(if there are new users)

router.post('/google-signin', async (req: Request, res: Response,) => {
  try {
    const { idtoken, role, schoolId, organizationId } = req.body;

    if (!idtoken || !role) {
      res.status(400).json({
        error: 'Missing required fields',
        message: "Required Idtoken, Role"

      })
      return
    }

    const decodeToken = await firebaseAuth.verifyToken(idtoken);
    const { name, email, uid } = decodeToken;

    let dbUser;

    try {
      const dbCheck = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/firebase/${uid}`);

      dbUser = dbCheck.data;
    } catch {
      dbUser = null;

    }

    const newUser = !dbUser;

    if (newUser) {
      const userServiceResponse = await axios.post(
        `${process.env.USER_SERVICE_URL}/api/users`,
        {
          email,
          name,
          role,
          ...(schoolId && { schoolId }),
          ...(organizationId && { organizationId })
        }
      );
      dbUser = userServiceResponse.data;


      // Set custom claims in Firebase
      const customClaims: any = {
        role,
        userType: role.replace("_ADMIN", "")
      };

      if (schoolId) customClaims.schoolId = schoolId;
      if (dbUser.organizationId) customClaims.organizationId = dbUser.organizationId;

      await firebaseAuth.setCustomClaims(uid, customClaims);

      // Return success (user needs to login to get token)
      res.json({
        message: newUser ? "User created Sucessfully " : "Login Sucessful",
        user: dbUser,
      });

    }
  } catch (error: any) {
    console.error("Google-Sign In Error: ", error)
    res.status(500).json({
      error: "Google-Sign In Failed",
      message: error.message

    })
  }
})



//refresh token

router.post('/refresh', verifyToken, async (req: Request, res: Response) => {
  try {
    // Force token refresh to get updated custom claims
    await firebaseAuth.revokeRefreshTokens(req.user!.uid);

    res.json({
      message: 'Token refresh required',
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      error: 'Token refresh failed',
      message: error.message
    });
  }
});

//get the current user
router.get('/me', async (req: Request, res: Response) => {
  try {
    const userServiceResponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/${req.user!.uid}`, {
      headers: {
        "X-User-Id": req.user!.uid,
        "X-User-Role": req.user!.role
      }
    });

    res.json({
      user: userServiceResponse.data
    })
  } catch (error: any) {
    console.error("Get Current user error: ", error);
    res.status(500).json({
      error: "Failed to get user Data",
      message: error.message
    })
  }
})


//Logout
router.post('/logout', verifyToken, async (req: Request, res: Response) => {
  try {
    // revoke all refresh tokens for this user
    await firebaseAuth.revokeRefreshTokens(req.user!.uid);

    res.json({
      message: 'Logged out successfully',
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      message: error.message
    });
  }
});


//TODO:password reset link and email verifiction



export default router;
