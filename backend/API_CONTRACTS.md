# API Contracts for User Endpoints

## 1. Get User by ID (`getUserById`)

### Request
```typescript
Headers: {
  "x-user-uid": string,
  "x-user-type": "STUDENT" | "TEACHER" | "SCHOOL_ADMIN" | "ORG_ADMIN" | "SUPER_ADMIN"
}
```

### Response - Student

```typescript
{
  "message": "Student fetched successfully",
  "userType": "STUDENT",
  "user": {
    "uid": string,
    "name": string,
    "email": string,
    "date_of_birth": string (ISO 8601),
    "contact_number": string | null,
    "gender": string,
    "profile_picture": string | null,
    "is_active": boolean,
    "is_frozen": boolean,
    "grade": string,
    "about": string | null,
    "created_at": string (ISO 8601),
    "updated_at": string (ISO 8601),
    "school_id": string,
    "clubIds": string[],
    "skills": Array<{
      "skill_id": number,
      "skill_name": string,
      "category": string | null
    }>
  }
}
```

### Response - Teacher

```typescript
{
  "message": "Teacher fetched successfully",
  "userType": "TEACHER",
  "user": {
    "uid": string,
    "name": string,
    "email": string,
    "date_of_birth": string (ISO 8601),
    "contact_number": string | null,
    "profile_picture": string | null,
    "is_active": boolean,
    "subject": string | null,
    "grade": string | null,
    "designation": string | null,
    "staff_id": string | null,
    "created_at": string (ISO 8601),
    "updated_at": string (ISO 8601),
    "school_id": string,
    "clubIds": string[],
    "pendingVerificationIds": string[],
    "processedVerificationIds": string[]
  }
}
```

### Response - Admin

```typescript
{
  "message": "Admin fetched successfully",
  "userType": "SCHOOL_ADMIN" | "ORG_ADMIN" | "SUPER_ADMIN",
  "user": {
    "uid": string,
    "name": string,
    "email": string,
    "date_of_birth": string (ISO 8601),
    "contact_number": string | null,
    "profile_picture": string | null,
    "is_active": boolean,
    "adminType": "SCHOOL_ADMIN" | "ORG_ADMIN" | "SUPER_ADMIN",
    "staff_id": string | null,
    "created_at": string (ISO 8601),
    "updated_at": string (ISO 8601),
    "school_id": string | null,
    "organization_id": string | null
  }
}
```

---

## 2. Get User by Firebase UID (`getUserByFirebaseUID`)

### Request
```typescript
GET /user/:uid
```

### Response - Student (Active & Not Frozen)

```typescript
{
  "userType": "STUDENT",
  "user": {
    "uid": string,
    "name": string,
    "email": string,
    "date_of_birth": string (ISO 8601),
    "contact_number": string | null,
    "gender": string,
    "profile_picture": string | null,
    "grade": string,
    "about": string | null,
    "school_id": string,
    "skills": Array<{
      "skill_id": number,
      "skill_name": string,
      "category": string | null
    }>
  }
}
```

**Note:** Only returns student if `is_active === true` AND `is_frozen === false`

### Response - Teacher (Active)

```typescript
{
  "userType": "TEACHER",
  "user": {
    "uid": string,
    "name": string,
    "email": string,
    "date_of_birth": string (ISO 8601),
    "contact_number": string | null,
    "profile_picture": string | null,
    "subject": string | null,
    "grade": string | null,
    "designation": string | null,
    "staff_id": string | null,
    "school_id": string
  }
}
```

**Note:** Only returns teacher if `is_active === true`

### Response - Admin

```typescript
{
  "userType": "SCHOOL_ADMIN" | "ORG_ADMIN" | "SUPER_ADMIN",
  "user": {
    "uid": string,
    "name": string,
    "email": string,
    "adminType": "SCHOOL_ADMIN" | "ORG_ADMIN" | "SUPER_ADMIN",
    "date_of_birth": string (ISO 8601),
    "contact_number": string | null,
    "profile_picture": string | null,
    "is_active": boolean,
    "staff_id": string | null,
    "created_at": string (ISO 8601),
    "updated_at": string (ISO 8601),
    "school_id": string | null,
    "organization_id": string | null
  }
}
```

### Error Response

```typescript
{
  "message": "User not found"
}
```

---

## Key Differences

| Aspect | getUserById | getUserByFirebaseUID |
|--------|------------|----------------------|
| **Auth Required** | Yes (via headers) | No (public lookup) |
| **Data Included** | Full user data (all fields) | Filtered fields (privacy) |
| **Student Skills** | ✅ Included | ✅ Included |
| **Status Check** | None required | is_active & is_frozen checked |
| **Use Case** | Get authenticated user's own data | Public user profile lookup |

---

## Skill Object Structure

```typescript
interface Skill {
  skill_id: number;          // Auto-incremented primary key
  skill_name: string;        // Unique skill name (e.g., "JavaScript", "Leadership")
  category: string | null;   // Optional category (e.g., "Technical", "Soft Skills")
}
```

---

## Frontend Integration Tips

### For Student Profiles:
1. Always check for skills array in the response
2. Skills are only available for STUDENT user type
3. Display skills as badges or tags using `skill_name`
4. Group by `category` if displaying in a structured way

### For Private vs Public Views:
- Use `getUserById` for authenticated user's own profile (complete data)
- Use `getUserByFirebaseUID` for viewing other user profiles (filtered data)

### Error Handling:
- 400: Missing required headers/params
- 404: User not found or account is frozen/inactive
- 500: Server error
