import express from "express"
import path from 'path'
import { fileURLToPath } from 'url';
import session from "express-session";


const app = express();

// To parse JSON bodies
app.use(express.json());
// To parse URL-encoded bodies (e.g., from HTML forms)
app.use(express.urlencoded({ extended: true }));

// load session
app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }, // Change to `secure: true` in production if using HTTPS
    })
  );

// load ejs file
app.set('view engine', 'ejs');

// load the folder for view so that we can load view with name directly
const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory
//to load view folder
app.set('views', [path.join(__dirname, 'views'),path.join(__dirname, 'views/auth'),path.join(__dirname, 'views/layouts'),path.join(__dirname, 'views/layouts/blocks'),path.join(__dirname, 'views/patient')]);

// get images/css/js from public folder
app.use(express.static("public"))
app.use(express.static(path.join(__dirname, 'public')));

// Define a global variable for the header to check login status
// jo login k baad set karte hai vo value yha aa jati hai aur kahi b access ho jaati hai
//variable user me user details yhi se milti hai


app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    
    next();
});

import userRouter from './routes/user.router.js'
import adminRouter from './routes/admin.router.js'

//redirect to login when write home url
app.get('/', (req, res) => {
  res.redirect('/user/login');  // Redirect to /new-route
});

// just to get urls in navbar
// app.get('/admin/:id', (req, res) => {
//   app.locals.fullUrl = req.originalUrl; // Or req.url
//   // console.log(`full url ${fullUrl}`) 
// });

app.use((req, res, next) => {
  res.locals.fullUrl = req.originalUrl;
  res.locals.globalVar = 'This is a global variable set in middleware';
  next();  // Pass the request to the next middleware/route handler
});

//routes declaration user is prefix here
app.use("/user",userRouter)
app.use("/admin",adminRouter)

 
export { app }