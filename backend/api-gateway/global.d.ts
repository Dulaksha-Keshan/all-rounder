declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT?: string;
      FIREBASE_PROJECT_ID?: string;
      FIREBASE_CLIENT_EMAIL?: string;
      FIREBASE_PRIVATE_KEY?: string;
    }
  }

  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: string; //TODO:change this to a  UserRole type later 
        schoolId?: string;
        organizationId?: string;
        userType: string;
        //role: 'student' | 'teacher' | 'school_admin' | 'org_admin';
        //TODO:figure out the best possible way to handle the roles as it comes as a custom claim also its a enum declared in prisma so wait till prisma is done 
        //
        //Also userType which also will be a custom claim stating if its a person or a org/school  
        //
        //
        //
        //export enum UserRole {
        //  STUDENT = 'STUDENT',
        //  TEACHER = 'TEACHER',
        //  SCHOOL_ADMIN = 'SCHOOL_ADMIN',
        //  ORG_ADMIN = 'ORG_ADMIN',
        //  SUPER_ADMIN = 'SUPER_ADMIN',
        //}
      }
    }
  }
}
export { };
