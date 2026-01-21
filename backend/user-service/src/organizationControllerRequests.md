GET /api/organizations HTTP/1.1
Host: localhost:3000

GET /api/organizations/1 HTTP/1.1
Host: localhost:3000

{
"organization_name": "Tech Innovators Ltd",
"contact_person": "Sarah Jenkins",
"website": "https://techinnovators.com",
"admin": {
"firebaseUID": "firebase_uid_12345",
"userType": "ORG_ADMIN",
"name": "Sarah Jenkins",
"email": "sarah@techinnovators.com",
"password": "SecurePassword123!",
"date_of_birth": "1990-05-15T00:00:00.000Z"
}
}

{
"adminId": 1,
"contact_person": "Sarah J. Smith",
"website": "https://new-website-url.com"
}
