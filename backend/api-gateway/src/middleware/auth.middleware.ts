import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { firebaseAuth } from "../config/firebase-admin.js";

//token verifier 
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: `Unauthorized, No token provided `
      });

      return;
    }

    const token = authHeader.split("Bearer ")[1];

    const decodedToken: DecodedIdToken = await firebaseAuth.verifyToken(token as string);

    const customClaims = decodedToken as any;

    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      role: customClaims.role || null,
      schoolId: customClaims.schoolId,
      organizationId: customClaims.organizationId,
      userType: customClaims.userType || "",
    };

    next()


  } catch (error: any) {
    console.error('Token verification error:', error.message);

    if (error.message.includes('expired')) {
      res.status(401).json({
        error: 'Token expired',
        message: 'Please refresh your token'
      });
      return;
    }

    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid token'
    });
  }
}

// Role checker 
export async function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        message: `Unauthorized, Authentication Required `
      })
      return
    }


    const allowed = allowedRoles.includes(req.user.role);

    if (!allowed) {
      res.status(401).json({
        message: `Forbidden, Access Denied. Required Roles to access: ${allowedRoles.join(", ")}`
      })

      return
    }

    next();
  }
}


// check for owenership if needed for us 
export async function requireOwenership(userIdParam: string = "userId") {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required."
      })
      return
    }

    const resourceUserId = req.params[userIdParam];
    //TODO:THE role check is hard coded have to make it enum when enum situatiuon is done 
    if (req.user.uid !== resourceUserId && req.user.role !== "SUPER_ADMIN") {
      res.status(403).json({
        error: "Forbidden",
        message: "You can only access your own resources."
      })
      return
    }


    next();

  }
}

//School acess checker 
export async function requireSchoolAccess(schoolIdParam: string = "schoolId") {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: "Unauthorized",
        message: "Authentication required."
      })
      return
    }

    const resourceSchoolId = req.params[schoolIdParam];
    //TODO:THE role check is hard coded have to make it enum when enum situatiuon is done 
    if (req.user.schoolId !== resourceSchoolId && req.user.role !== "SUPER_ADMIN") {
      res.status(403).json({
        error: "Forbidden",
        message: "You can only access resources from your own resources."
      })
      return
    }


    next();


  }
}



export const authMiddleware = {
  verifyToken,
  requireRole,
  requireOwenership,
  requireSchoolAccess,
}
