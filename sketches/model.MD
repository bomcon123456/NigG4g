###1. Collections / Model
    - Users
        - Avatar
        - Username
        - Password
        - Email
        - Active
        - Social
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

    - GET -> /api/get/:id/comments/ = get that post's comments
    - GET -> /api/get/:id/comments/:commentId = get that post's comment
    - POST -> /api/posts/:id/comments = create comment for that post
    - DELETE -> /api/posts/:id/comments/:commentId = delete comment for that post
    - PUT -> /api/posts/:id/comments/:commentId = update comment for that post

    - GET -> api/posts/:id/comments/:commentId/subComments/ = get that post's comment's subcomments
    - GET -> api/posts/:id/comments/:commentId/subComments/:subCommentId = get that post's comment's subcomment 
    - POST -> /api/posts/:id/comments/:commentId/subComments = create subcomment for that comment
    - DELETE -> api/posts/:id/comments/:commentId/subComments/:subCommentId = delete subcomment for that comment
    - PUT -> api/posts/:id/comments/:commentId/subComments/:subCommentId = update subcomment for that comment 

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
    - Birthday
    - Posts -> Model
    - Comments -> [postId]
    - Upvotes