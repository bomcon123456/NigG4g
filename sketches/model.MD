###1. Collections / Model
    - Users
        - Avatar
        - Username
        - Password
        - Email
        - Active
        - Gender
        - Birthday
        - Posts -> Model
        - Comments -> [postId]
        - Upvotes

    - Post
        - Title
        - Content (Image)
        - Points
        - Category
        - Active
        - Comment
            - CreatedBy
            - Content 
            - Subcomment: []
            - Points

    - Category
        - Name
        - Active

### 2. Controller
CRUD
    - Create
    - Read - Get items with Active == true
    - Update
    - Delete - Set Active == false

### 3. Route
URI: /api/users/
    - POST -> /api/users/ = create new user
    - GET -> /api/users/:id = read that user
    - DELETE -> /api/users/:id = delete that user
    - PUT -> /api/users/:id = update that user

URI: /api/auth/
    - POST -> /api/auth/ = login

URI: /api/posts/
    - POST -> /api/posts/ = create new post
    - GET -> /api/posts/?page = get all posts for that page

    - GET -> /api/posts/:id = read that post
    - DELETE -> /api/posts/:id = delete that post
    - PUT -> /api/posts/:id = update that post

    - POST -> /api/posts/:id/comments = create comment for that post
    - DELETE -> /api/posts/:id/comments/:commentId = delete comment for that post
    - PUT -> /api/posts/:id/comments/:commentId = update comment for that post
    
### 4. Cooked Data


- /api/posts
    - Title
    - Content (Image)
    - Points
    - Category
    - Comment
        - CreatedBy
        - Content 
        - Subcomment: []
        - Points

- /api/users
    - Avatar
    - Username
    - Email
    - Gender
    - Birthday
    - Posts -> Model
    - Comments -> [postId]
    - Upvotes