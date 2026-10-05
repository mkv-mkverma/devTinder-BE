##authRouter

- POST /auth/signup
- POST /auth/login
- POST /auth/logout

##profileRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

##connectionRequestRouter

- POST /request/send/intrest/:userId
- POST /request/send/ignore/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/rejected/:requestId

##userRouter

- GET /connections
- GET /requests/received
- GET /feed - get the profile of other platform

