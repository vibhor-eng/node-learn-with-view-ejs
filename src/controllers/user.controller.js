import { asyncHandler } from "../utils/asyncHandler.js";
import { encryptData,decryptData } from "../utils/helper.js";

import { User } from "../models/user.model.js";
import { Feedback } from "../models/feedback.model.js";

import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode'
import url from 'url'
import multer from "multer";

const LoginPage = asyncHandler(async (req,res) => {

    if(req.method === 'POST'){
        try{
            //login with email or name with password
            const {email,username,password} = req.body

            if(!username && !email){
                res.render("login.ejs", {
                    errorMessage: "username or email is required."
                });
            }
        
            const user = await User.findOne({
                $or:[{username},{email}] //find by email or username
            })

            //### findOne ye sab User modal k pass hai but jo custom method hai jaise isPasswrdCorret ye user k pass jai
            if(!user){
                res.render("login.ejs", {
                    errorMessage: "user does not exist."
                });
            }

            const isPassValid = await user.isPasswordCorrect(password) //paasword req.body vaala upar

            if(!isPassValid){
                res.render("login.ejs", {
                    errorMessage: "Password Incorrect."
                });
            }
            
            req.session.userId = user._id;
            req.session.user = user;
            res.redirect('/user/home');
            return
        }catch(error){
            res.render("login.ejs", {
                errorMessage: error
            });
        }
    }
    
    res.render('login');
})

const RegisterPage = asyncHandler(async (req,res) => {

    if(req.method === 'POST'){

        try{

            const {name,username,email,password,age,mobile,gender} = req.body

            // all parameter check once empty
            if([name,email,username,password,age,mobile,gender].some((field) => 
                field?.trim() === "")
            ){
                res.render("register.ejs", {
                    errorMessage: "All fields are required."
                });
            }

            const existedUser = await User.findOne({
                $or: [{ mobile },{ email },{ email }] //check email or username
            })
    
            if(existedUser){
                res.render("register.ejs", {
                    errorMessage: "User with email, mobile or username is already exist."
                });
            }

            const user = await User.create({
                name, 
                username,
                email,
                password,
                age,
                mobile,
                gender,
            })

            //check user is created
            const CreatedUsers = await User.findById(user._id).select("-password -refreshToken")

            if(!CreatedUsers){
                res.render("register.ejs", {
                    errorMessage: "Something went wrong when registering a user."
                });
            }
    
            
            res.render("register.ejs", {
                successMessage: "User Registered.."
            });
            
        }catch(error){
            res.render("register.ejs", {
                errorMessage: error
            });
        }

    }
    
    res.render('register');
})

const HomePage = asyncHandler(async(req,res) => {

    try{

        const PatinetDetails = "id="+req.session.user._id+"&name="+req.session.user.name+"&email="+req.session.user.email+"&age="+req.session.user.age+"&mobile="+req.session.user.mobile;

        const protocol = req.protocol; // 'http' or 'https'
        const host = req.get('host');  // 'localhost:3000' or similar
        const baseUrl = `${protocol}://${host}`;

        const data = baseUrl+"/user/feedback?"+PatinetDetails;  // Data to encode in the QR code

        

        QRCode.toDataURL(data, (err, url) => {
            if (err) throw err;

            res.render('dashboard.ejs', { url: url });
        });

    }catch(error){
        // console.log(error)
        res.render("home.ejs", {
            errorMessage: error
        });
    }
})

const Logout = asyncHandler(async(req,res) => {

    req.session.destroy((err) => {
        if (err) {
          return res.redirect('/user/home');
        }
        res.redirect('/user/login');
    });

})

const FeedbackForm = asyncHandler(async(req,res) => {

    try{

        if(req.method === 'POST'){

            try{
            const {name, patient_id, email, age, mobile, message} = req.body

            const feedback = await Feedback.create({
                name, 
                patient_id,
                email,
                age,
                mobile,
                message,
            })

            //check user is created
            const CreatedFeedback = await Feedback.findById(feedback._id);

            if(!CreatedFeedback){
                res.render("feedback.ejs", {
                    errorMessage: "Something went wrong when registering a user."
                });
            }
    
            res.render("feedback.ejs", {
                successMessage: "Feedback registered."
            });

            }catch(error){
                console.log(error)
                res.render("feedback.ejs", {
                    errorMessage: error
                });
            }
          

        }

        const completeUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const myUrl = new URL(completeUrl);

        const searchParams = myUrl.searchParams;
       
        // console.log('Query String:', searchParams);

        const id = searchParams.get('id');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const age = searchParams.get('age');
        const mobile = searchParams.get('mobile');
        
        res.render('feedback.ejs', {id:id,name:name,email:email,age:age,mobile:mobile});

    }catch(error){
        // console.log(error)
        res.render("feedback.ejs", {
            errorMessage: error
        });
    }

})



export  {
    LoginPage,RegisterPage,HomePage,Logout,FeedbackForm
}