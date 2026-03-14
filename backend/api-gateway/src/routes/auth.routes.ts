import express, { Request, Response } from 'express'
import { firebaseAuth } from '../config/firebase-admin.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import axios from 'axios';



const router = express.Router();


//Register with email and password

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, grade, schoolId, organizationId, verificationOption, dateOfBirth,teacher_id } = req.body;

    if (!email || !password || !name || !role) {
      res.status(400).json({
        error: 'Missing required fields',
        message: "Required Email, Password, Role, Name"
      })
      return
    }



    const validRoles = ['STUDENT', 'TEACHER', 'SCHOOL_ADMIN', 'ORG_ADMIN', 'SUPER_ADMIN'];
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
      const userPayload: any = {
        uid: firebaseUser.uid,
        email,
        name,
        date_of_birth: new Date(dateOfBirth),
        userType: role,
        school_id: schoolId ? schoolId : null,
        organization_id: organizationId,
        verificationOption: verificationOption || "DOCUMENT"
      };

      if (role === "STUDENT" || role === "TEACHER") {
        userPayload.grade = grade ? grade : null;
      }
      if(verificationOption === "TEACHER_REQUEST"){
        userPayload.teacher_id = teacher_id ? teacher_id : null;
      }
      console.log("User Payload for User Service:", userPayload);

      const userServiceResponse = await axios.post(
        `${process.env.USER_SERVICE_URL}/api/users`,
        userPayload
      );


      const dbUser = userServiceResponse.data;

      // Set custom claims in Firebase
      const customClaims: any = {
        role,
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
      if (dbError.response) {
        console.error(" User Service Rejected Request:", dbError.response.data);
      } else {
        console.error("Network/Connection Error:", dbError.message);
      }

      // Rollback
      await firebaseAuth.deleteUser(firebaseUser.uid);

      // Pass the *actual* error message to the frontend so you can see it in Postman
      const actualMessage = dbError.response?.data?.message || dbError.message;
      throw new Error(actualMessage);
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

// router.post('/google-signin', async (req: Request, res: Response,) => {
//   try {
//     const { idtoken, role, schoolId, organizationId } = req.body;

//     if (!idtoken || !role) {
//       res.status(400).json({
//         error: 'Missing required fields',
//         message: "Required Idtoken, Role"

//       })
//       return
//     }

//     const decodeToken = await firebaseAuth.verifyToken(idtoken);
//     const { name, email, uid } = decodeToken;

//     let dbUser;

//     try {
//       const dbCheck = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/firebase/${uid}`);

//       dbUser = dbCheck.data;
//     } catch {
//       dbUser = null;

//     }

//     const newUser = !dbUser;

//     if (newUser) {
//       const userServiceResponse = await axios.post(
//         `${process.env.USER_SERVICE_URL}/api/users`,
//         {
//           email,
//           name,
//           role,
//           ...(schoolId && { schoolId }),
//           ...(organizationId && { organizationId })
//         }
//       );
//       dbUser = userServiceResponse.data;


//       // Set custom claims in Firebase
//       const customClaims: any = {
//         role,
//         userType: role.replace("_ADMIN", "")
//       };

//       if (schoolId) customClaims.schoolId = schoolId;
//       if (dbUser.organizationId) customClaims.organizationId = dbUser.organizationId;

//       await firebaseAuth.setCustomClaims(uid, customClaims);

//       // Return success (user needs to login to get token)
//       res.json({
//         message: newUser ? "User created Sucessfully " : "Login Sucessful",
//         user: dbUser,
//       });

//     }
//   } catch (error: any) {
//     console.error("Google-Sign In Error: ", error)
//     res.status(500).json({
//       error: "Google-Sign In Failed",
//       message: error.message

//     })
//   }
// })

//TODO:GOOGLE SIGN IN
router.post('/google-signin', async (req: Request, res: Response) => {
  try {
    const { idtoken, role, schoolId, organizationId } = req.body;

    // 1. Only require the idtoken initially
    if (!idtoken) {
      res.status(400).json({
        error: 'Missing required fields',
        message: "Required Idtoken"
      });
      return;
    }

    const decodeToken = await firebaseAuth.verifyToken(idtoken);
    const { name, email, uid } = decodeToken;

    let dbUser;

    try {
      // 2. Check if the user already exists in PostgreSQL
      const dbCheck = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/firebase/${uid}`);
      dbUser = dbCheck.data;
    } catch {
      dbUser = null;
    }

    const newUser = !dbUser;

    if (newUser) {
      // 3. If they are NEW, we absolutely need a role to create their profile
      if (!role) {
         res.status(400).json({
           error: 'Role required for registration',
           message: 'New users must register through a specific role sign-up page, not the general login page.'
         });
         return;
      }

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
    }

    // 4. Return success (works for both existing users logging in, and new users signing up!)
    res.json({
      message: newUser ? "User created Successfully " : "Login Successful",
      user: dbUser,
    });

  } catch (error: any) {
    console.error("Google-Sign In Error: ", error)
    res.status(500).json({
      error: "Google-Sign In Failed",
      message: error.message
    });
  }
});


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
router.get('/me', verifyToken, async (req: Request, res: Response) => {
  try {
    const userServiceResponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/`, {
      headers: {
        "x-user-uid": req.user!.uid,
        "x-user-type": req.user!.role
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
});


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
