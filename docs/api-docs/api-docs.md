# CampusConnect API Documentation

The authentication endpoints manage user session and registration workflow.

---

## Authentication Endpoints

### 1. Register User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "full_name": "John Doe",
  "username": "johndoe24",
  "email": "john.doe@university.edu",
  "password": "SecurePassword123",
  "department": "Computer Science",
  "academic_year": "Sophomore",
  "profile_picture_url": ""
}
```
- **Success Response (201 Created)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "accessToken": "eyJhbGciOi...",
  "user": {
    "id": "787c805a-2771-460d-959c-85bd7cc7cfbe",
    "full_name": "John Doe",
    "username": "johndoe24",
    "email": "john.doe@university.edu",
    "role": "student",
    "department": "Computer Science",
    "academic_year": "Sophomore"
  }
}
```
- **Error Response (400 Bad Request)**:
```json
{
  "success": false,
  "error": "Username or email already exists"
}
```

---

### 2. Login User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "email": "john.doe@university.edu",
  "password": "SecurePassword123"
}
```
- **Success Response (200 OK)**:
Sets a secure `HttpOnly` cookie for the refresh token and returns:
```json
{
  "success": true,
  "accessToken": "eyJhbGciOi...",
  "user": {
    "id": "787c805a-2771-460d-959c-85bd7cc7cfbe",
    "full_name": "John Doe",
    "username": "johndoe24",
    "email": "john.doe@university.edu",
    "role": "student"
  }
}
```

---

### 3. Refresh Access Token
- **URL**: `/api/auth/refresh`
- **Method**: `POST`
- **Cookies**: Requires `refreshToken` set as an `HttpOnly` cookie.
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "accessToken": "eyJhbGciOi..."
}
```

---

### 4. Logout User
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Success Response (200 OK)**:
Clears the `refreshToken` cookie.
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### 5. Get Current Logged In User
- **URL**: `/api/users/me`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <access_token>`
- **Success Response (200 OK)**:
```json
{
  "success": true,
  "user": {
    "id": "787c805a-2771-460d-959c-85bd7cc7cfbe",
    "full_name": "John Doe",
    "username": "johndoe24",
    "email": "john.doe@university.edu",
    "role": "student",
    "department": "Computer Science",
    "academic_year": "Sophomore"
  }
}
```
