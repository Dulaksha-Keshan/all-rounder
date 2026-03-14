import express, { Request, Response } from 'express'
import { firebaseAuth } from '../config/firebase-admin.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import axios from 'axios';
import multer from 'multer';
import FormData from 'form-data';



const router = express.Router();

const registerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Allowed types: PDF, JPEG, PNG, WEBP'));
      return;
    }

    cb(null, true);
  },
});

const handleRegisterUpload = (req: Request, res: Response, next: () => void): void => {
  registerUpload.single('verificationAttachment')(req, res, (error: unknown) => {
    if (!error) {
      req.file?.size && console.log(`Received file: ${req.file.originalname} (${req.file.size} bytes)`);
      next();
      return;
    }

    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        error: 'Invalid file',
        message: 'File too large. Maximum allowed size is 5MB',
      });
      return;
    }

    const errorMessage = error instanceof Error ? error.message : 'File upload failed';
    res.status(400).json({
      error: 'Invalid file',
      message: errorMessage,
    });
  });
};


//Register with email and password

router.post('/register', handleRegisterUpload, async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, grade, schoolId, organizationId, verificationOption, dateOfBirth,teacher_id,gender} = req.body;
    const verificationAttachment = req.file;
    console.log(req.file)
    const selectedVerificationOption = verificationOption || 'DOCUMENT';

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

    if (
      (role === 'STUDENT' || role === 'TEACHER') &&
      selectedVerificationOption === 'DOCUMENT' &&
      !verificationAttachment
    ) {
      res.status(400).json({
        error: 'Missing required fields',
        message: 'verificationAttachment is required for DOCUMENT verification',
      });
      return;
    }

    const firebaseUser = await firebaseAuth.createUser(email, password, name);

    // Forward to User Service to create in PostgreSQL
    try {
      const userPayload = new FormData();
      userPayload.append('uid', firebaseUser.uid);
      userPayload.append('email', email);
      userPayload.append('name', name);
      userPayload.append('userType', role);
      userPayload.append('verificationOption', selectedVerificationOption);

      if (dateOfBirth) {
        const parsedDate = new Date(dateOfBirth);
        if (Number.isNaN(parsedDate.getTime())) {
          throw new Error('Invalid dateOfBirth');
        }
        userPayload.append('date_of_birth', parsedDate.toISOString());
      }

      if (schoolId) {
        userPayload.append('school_id', schoolId);
      }

      if (organizationId) {
        userPayload.append('organization_id', organizationId);
      }

      if(role === "STUDENT" && gender){
        userPayload.append('gender', gender);
      }

      if ((role === 'STUDENT' || role === 'TEACHER') && grade) {
        userPayload.append('grade', grade);
      }

      if (selectedVerificationOption === 'TEACHER_REQUEST' && teacher_id) {
        userPayload.append('teacher_id', teacher_id);
      }

      if (verificationAttachment) {
        userPayload.append('verificationAttachment', verificationAttachment.buffer, {
          filename: verificationAttachment.originalname,
          contentType: verificationAttachment.mimetype,
        });
      }

      console.log('Forwarding register payload to User Service');

      const userServiceResponse = await axios.post(
        `${process.env.USER_SERVICE_URL}/api/users`,
        userPayload,
        {
          headers: userPayload.getHeaders(),
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
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


//doesnt need jsut gonna pass the request to the user service directly 
// //get the current user
// router.get('/me', verifyToken, async (req: Request, res: Response) => {
//   try {
//     const userServiceResponse = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/`, {
//       headers: {
//         "x-user-uid": req.user!.uid,
//         "x-user-type": req.user!.role
//       }
//     });

//     res.json({
//       user: userServiceResponse.data
//     })
//   } catch (error: any) {
//     console.error("Get Current user error: ", error);
//     res.status(500).json({
//       error: "Failed to get user Data",
//       message: error.message
//     })
//   }
// });


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
