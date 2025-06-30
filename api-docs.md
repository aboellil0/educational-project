# Quran Memorization & Islamic Education Platform API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication Endpoints

### Register User
- **POST** `/auth/register`
- **Description**: Register a new user
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "quranMemorized": "string",
  "numOfPartsofQuran": "number"
}
```
- **Response**: 201 Created
```json
{
  "message": "User registered successfully. Please verify your email.",
  "accessToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### Login
- **POST** `/auth/login`
- **Description**: Authenticate user and get tokens
- **Request Body**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **Response**: 200 OK
```json
{
  "message": "Login successful",
  "accessToken": "string",
  "user": {
    "id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### Social Login
- **POST** `/auth/google`
- **Description**: Login with Google
- **Request Body**:
```json
{
  "idToken": "string"
}
```

### Password Reset
- **POST** `/auth/forgot-password`
- **Request Body**:
```json
{
  "email": "string"
}
```

- **POST** `/auth/reset-password`
- **Request Body**:
```json
{
  "token": "string",
  "password": "string"
}
```

## User Management Endpoints

### Get User Profile
- **GET** `/users/profile`
- **Authorization**: Bearer Token required
- **Response**: 200 OK
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "string",
    "quranMemorized": "string",
    "numOfPartsofQuran": "number"
  }
}
```

### Update User Profile
- **PUT** `/users/profile`
- **Authorization**: Bearer Token required
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string"
}
```

## Lesson Management Endpoints

### Get Lesson by ID
- **GET** `/lessons/:id`
- **Authorization**: Bearer Token required
- **Response**: 200 OK
```json
{
  "id": "string",
  "groupId": {
    "name": "string",
    "description": "string",
    "type": "string"
  },
  "subject": "string",
  "scheduledAt": "date",
  "meetingLink": "string",
  "status": "string"
}
```

### Add Lesson to Group
- **POST** `/lessons/group/:id`
- **Authorization**: Bearer Token required
- **Request Body**:
```json
{
  "subject": "string",
  "scheduledAt": "date",
  "meetingLink": "string"
}
```

## Group Management Endpoints

### Create Group
- **POST** `/groups`
- **Authorization**: Bearer Token required
- **Request Body**:
```json
{
  "name": "string",
  "description": "string",
  "type": "private | public",
  "teacherId": "string",
  "meetingLink": "string",
  "usualDate": {
    "firstDay": "string",
    "firstDayTime": "string",
    "secondDay": "string",
    "secondDayTime": "string"
  }
}
```

### Add Member to Group
- **POST** `/groups/:id/members`
- **Authorization**: Bearer Token required
- **Request Body**:
```json
{
  "memberId": "string"
}
```

## Teacher Management Endpoints

### Create Teacher
- **POST** `/teachers`
- **Authorization**: Bearer Token (Admin) required
- **Request Body**:
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "specialization": ["string"],
  "meetingLink": "string",
  "availability": "object"
}
```

### Get Teacher Groups
- **GET** `/teachers/:id/groups`
- **Authorization**: Bearer Token required

## Report Management Endpoints

### Create Lesson Report
- **POST** `/reports/lessons/:lessonId`
- **Authorization**: Bearer Token (Teacher) required
- **Request Body**:
```json
{
  "studentId": "string",
  "attended": "boolean",
  "content": "string",
  "newMemorized": "string",
  "notes": "string",
  "rating": "number"
}
```

### Get Student Reports
- **GET** `/reports/students/:id`
- **Authorization**: Bearer Token required

## Admin Endpoints

### Get All Users
- **GET** `/admin/users`
- **Authorization**: Bearer Token (Admin) required

### Verify User
- **PUT** `/admin/users/verify`
- **Authorization**: Bearer Token (Admin) required
- **Request Body**:
```json
{
  "userId": "string"
}
```

### Update User Credits
- **PUT** `/admin/users/credits`
- **Authorization**: Bearer Token (Admin) required
- **Request Body**:
```json
{
  "userId": "string",
  "privateAmount": "number",
  "publicAmount": "number"
}
```

## Common Response Formats

### Success Response
```json
{
  "success": true,
  "message": "string",
  "data": "object"
}
```

### Error Response
```json
{
  "success": false,
  "message": "string",
  "error": {
    "code": "string",
    "details": "object"
  }
}
```

## Authentication
All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Rate Limiting
API requests are subject to rate limiting. Current limits:
- 100 requests per IP per 15 minutes for public endpoints
- 1000 requests per IP per 15 minutes for authenticated endpoints

## Notes
- All timestamps are in ISO 8601 format
- All IDs are MongoDB ObjectIDs
- File upload size limit: 5MB
- Request body should be in JSON format with Content-Type: application/json header