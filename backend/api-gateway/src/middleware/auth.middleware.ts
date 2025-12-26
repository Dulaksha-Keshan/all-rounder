import { NextFunction, Request, Response } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { firebaseAuth } from "../config/firebase-admin.js";

export async function verifyToekn(req: Request, res: Response, next: NextFunction) {
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
