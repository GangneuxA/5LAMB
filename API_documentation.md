# API Documentation

## Signup Endpoint

### Endpoint
`POST /auth/signup`

### Description
This endpoint allows a new user to sign up by providing their username, password, and email.

### Handler
`src/auth/sigin.handler`

### Events
- **HTTP**:
    - **Path**: `/auth/signup`
    - **Method**: `POST`
    - **CORS**: `true`

### Request Schema
- **Content-Type**: `application/json`
- **Schema**:
    ```json
    {
        "type": "object",
        "properties": {
            "username": {
                "type": "string"
            },
            "password": {
                "type": "string"
            },
            "email": {
                "type": "string"
            }
        },
        "required": ["username", "password", "email"]
    }
    ```

### Request Parameters
- **username**: `string` (required)
- **password**: `string` (required)
- **email**: `string` (required)

### Example Request
```json
{
    "username": "exampleUser",
    "password": "examplePass",
    "email": "user@example.com"
}
```

### Response
- **Success**: `201 Created`
    ```json
    {
        "message": "User created and added to group successfully"
    }
    ```
- **Error**: `500 Bad Request`
    ```json
    {
        "error": "Message errror"
    }
    ```



## Login Endpoint

### Endpoint
`POST /auth/login`

### Description
This endpoint allows an existing user to log in by providing their username and password.

### Handler
`src/auth/login.handler`

### Events
- **HTTP**:
- **Path**: `/auth/login`
- **Method**: `POST`
- **CORS**: `true`

### Request Schema
- **Content-Type**: `application/json`
- **Schema**:
```json
{
    "type": "object",
    "properties": {
        "username": {
            "type": "string"
        },
        "password": {
            "type": "string"
        }
    },
    "required": ["username", "password"]
}
```

### Request Parameters
- **username**: `string` (required)
- **password**: `string` (required)

### Example Request
```json
{
"username": "exampleUser",
"password": "examplePass"
}
```

### Response
- **Success**: `200 OK`
```json
{
    "message": "Authentication successful",
    "idToken": "bearer-token",
    "customToken": "jwt-token"
}
```
- **Error**: `400 Unauthorized`
```json
{
    "message": "Authentication failed",
    "error": "error message",
}
```


## Create Post Endpoint

### Endpoint
`POST /posts`

### Description
This endpoint allows a user to create a new post by providing the title and content.

### Handler
`src/posts/create.handler`

### Events
- **HTTP**:
    - **Path**: `/posts`
    - **Method**: `POST`
    - **CORS**: `true`
    - **Authorizer**: `COGNITO_USER_POOLS`
    - **Roles**: `ADMIN / EDITOR`

### Headers
- **Authorization**: `Bearer <token>` (required)
- **X-Custom-Token**: `string` (required)

### Request Schema
- **Content-Type**: `application/json`
- **Schema**:
    ```json
    {
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            },
            "content": {
                "type": "string"
            }
        },
        "required": ["title", "content"]
    }
    ```

### Request Parameters
- **title**: `string` (required)
- **content**: `string` (required)

### Example Request
```json
{
    "title": "Example Title",
    "content": "Example content of the post."
}
```

### Response
- **Success**: `201 Created`
    ```json
    {
      "postId": "uuid",
      "title": "title",
      "content": "content",
      "createdAt": "date-time",
    }
    ```
- **Error**: `500 Internal Server Error`
    ```json
    {
        "error": "Error message"
    }
    ```

## Get Post Endpoint

### Endpoint
`GET /posts/{id}`

### Description
This endpoint allows a user to retrieve a post by its ID.

### Handler
`src/posts/get.handler`

### Events
- **HTTP**:
    - **Path**: `/posts/{id}`
    - **Method**: `GET`
    - **CORS**: `true`
    - **Authorizer**: `COGNITO_USER_POOLS`
    - **Roles**: `ADMIN / EDITOR / GUEST-AUTHOR`

### Headers
- **Authorization**: `Bearer <token>` (required)
- **X-Custom-Token**: `string` (required)

### Request Parameters
- **id**: `string` (required)

### Example Request
`GET /posts/123`

### Response
- **Success**: `200 OK`
    ```json
    {
      "postId": "uuid",
      "title": "title",
      "content": "content",
      "createdAt": "date-time",
    }
    ```
- **Error**: `404 Not Found`
    ```json
    {
        "error": "Post not found"
    }
    ```

## Search Posts Endpoint

### Endpoint
`GET /posts/search`

### Description
This endpoint allows a user to search for posts by title.

### Handler
`src/posts/search.handler`

### Events
- **HTTP**:
    - **Path**: `/posts/search`
    - **Method**: `GET`
    - **CORS**: `true`
    - **Authorizer**: `COGNITO_USER_POOLS`
    - **Roles**: `ADMIN / EDITOR / GUEST-AUTHOR`

### Headers
- **Authorization**: `Bearer <token>` (required)
- **X-Custom-Token**: `string` (required)

### Request Parameters
- **title**: `string` (optional)

### Example Request
`GET /posts/search?title=Example`

### Response
- **Success**: `200 OK`
    ```json
    [
    {
      "postId": "uuid",
      "title": "title",
      "content": "content",
      "createdAt": "date-time",
    }
    ]
    ```
- **Error**: `500 Internal Server Error`
    ```json
    {
        "error": "Error message"
    }
    ```

## Update Post Endpoint

### Endpoint
`PUT /posts/{id}`

### Description
This endpoint allows a user to update an existing post by providing the title and content.

### Handler
`src/posts/update.handler`

### Events
- **HTTP**:
    - **Path**: `/posts/{id}`
    - **Method**: `PUT`
    - **CORS**: `true`
    - **Authorizer**: `COGNITO_USER_POOLS`
    - **Roles**: `ADMIN / EDITOR `

### Headers
- **Authorization**: `Bearer <token>` (required)
- **X-Custom-Token**: `string` (required)

### Request Schema
- **Content-Type**: `application/json`
- **Schema**:
    ```json
    {
        "type": "object",
        "properties": {
            "title": {
                "type": "string"
            },
            "content": {
                "type": "string"
            }
        },
        "required": ["title", "content"]
    }
    ```

### Request Parameters
- **id**: `string` (required)
- **title**: `string` (required)
- **content**: `string` (required)

### Example Request
```json
{
    "title": "Updated Title",
    "content": "Updated content of the post."
}
```

### Response
- **Success**: `200 OK`
    ```json
    {
      "postId": "uuid",
      "title": "title",
      "content": "content",
      "createdAt": "date-time",
    }
    ```
- **Error**: `500 Not Found`
    ```json
    {
        "error": "Could not update post"
    }
    ```

## Delete Post Endpoint

### Endpoint
`DELETE /posts/{id}`

### Description
This endpoint allows a user to delete a post by its ID.

### Handler
`src/posts/delete.handler`

### Events
- **HTTP**:
    - **Path**: `/posts/{id}`
    - **Method**: `DELETE`
    - **CORS**: `true`
    - **Authorizer**: `COGNITO_USER_POOLS`
    - **Roles**: `ADMIN`

### Headers
- **Authorization**: `Bearer <token>` (required)
- **X-Custom-Token**: `string` (required)

### Request Parameters
- **id**: `string` (required)

### Example Request
`DELETE /posts/123`

### Response
- **Success**: `204 OK`
    ```json
    {
        "message": "Delete Successful"
    }
    ```
- **Error**: `500 Not Found`
    ```json
    {
        "error": "Could not delete post'"
    }
    ```

## Upload Media Endpoint

### Endpoint
`POST /media`

### Description
This endpoint allows a user to upload media files. in format bas64 beacause the front encode in base 64

### Handler
`src/media/upload.handler`

### Events
- **HTTP**:
    - **Path**: `/media`
    - **Method**: `POST`
    - **CORS**: `true`
    - **Authorizer**: `COGNITO_USER_POOLS`
    - **Roles**: `ADMIN / EDITOR `

### Headers
- **Authorization**: `Bearer <token>` (required)
- **X-Custom-Token**: `string` (required)

### Request Schema
- **Content-Type**: `application/json`
- **Schema**:
    ```json
    {
        "type": "object",
        "properties": {
            "filename": {
                "type": "string"
            },
            "contentType": {
                "type": "string"
            },
            "file": {
                "type": "string"
            }
        },
        "required": ["file", "filename"]
    }
    ```

### Request Parameters
- **filename**: `string` (required)
- **contentType**: `string` (optional)
- **file**: `string` (required)

### Example Request
```json
{
    "filename": "example.jpg",
    "contentType": "image/jpeg",
    "file": "base64encodedstring"
}
```

### Response
- **Success**: `201 Created`
    ```json
    {
        "message": "File uploaded successfully"
    }
    ```
- **Error**: `500 Internal Server Error`
    ```json
    {
        "error": "Could not upload file"
    }
    ```

## Get Media Endpoint

### Endpoint
`GET /media`

### Description
This endpoint allows a user to retrieve media files.

### Handler
`src/media/get.handler`

### Events
- **HTTP**:
    - **Path**: `/media`
    - **Method**: `GET`
    - **CORS**: `true`
    - **Authorizer**: `COGNITO_USER_POOLS`
    - **Roles**: `ADMIN / EDITOR / GUEST-AUTHOR`

### Headers
- **Authorization**: `Bearer <token>` (required)
- **X-Custom-Token**: `string` (required)

### Example Request
`GET /media`

### Response
- **Success**: `200 OK`
    ```json
        [
            "link"
        ]
    ```
- **Error**: `500 error fetch`
    ```json
    {
        "error": "error message"
    }
    ```
