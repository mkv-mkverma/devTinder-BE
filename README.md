# devTinder-BE

- routing
- middleware
- HTTP method
- creating express server
- connecting to DB
- error handle
- password encrypt and decrypt
- jwt authentication
- user schema
- utils - validations

#ROUTING

```
route/auth.js

import express from 'express'

const authRouter = express.Router()

authRouter.post('/', async (req, res)=>{
    res.status(200).json({})
})

export default authRouter
```

```
app.js

import authRouter from 'route/auth.js'
import express from 'express'
imort cors from 'cors'

const app = express()
app.use(express.json())
app.use(cors)

app.user('/', authRouter) // add route

app.listen(3000, ()=>{
    console.log()
})

```

#password

```
import bcrypt from "bcrypt";

// passwordHash will go and save in DB on signup
const passwordHash = await bcrypt.hash(passwordInputByUser, 10);


// on login get user by email will give user passwordHash
const isPasswordvalid = await bcrypt.compare(
    passwordInputByUser,
    passwordHash,
  );
```

#jwt token

```
// user login
const user = await User.findOne({ emailId });

// create token
const token = await jwt.sign({ _id: user.id } "DEV@Tinder$123", {
    expiresIn: "7d", // 1h, 60*60
  });

// attach token to cookie
   res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: new Date(Date.now() + 8 * 3600000),
      });

// send cookie to every request get cookie
 const { token } = req.cookies;
 const decodedObj = jwt.verify(token, "DEV@Tinder$123");

    const { _id } = decodedObj;

     const user = await User.findById(_id);



```

- Login: find the user by email and check the password with bcrypt. ✅
- Create token: jwt.sign(payload, secret, { expiresIn }) packs the user's \_id into a token and signs it with the secret, so nobody can change it without the secret. ✅
- Attach to cookie: res.cookie("token", token) sends it to the browser, and the browser stores it. ✅
- Every request: the browser sends the cookie back automatically, and you read it with req.cookies (via cookie-parser). ✅
- Verify: jwt.verify(token, secret) checks the signature and the expiry. If it passes, it gives back the payload ({ \_id, iat, exp }). ✅
- Identify the user: you use the \_id to fetch the user from the database and attach it to req.user. ✅

#validator

```
import validator from "validator";
const validatoreSignupData = (req)=>{
const {email, password} = req.body ?? {}

    if(!validator.isEmail(email)){
        throw new Error('')
    }else if(!validator.isStrongPassword(password)){
        throw new Error('')
    }
}
```

#db connection

#middleware
