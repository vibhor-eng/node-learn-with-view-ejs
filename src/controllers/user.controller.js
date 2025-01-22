import { asyncHandler } from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";

import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

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

            const {name,email,password,age,mobile,gender} = req.body

            // all parameter check once empty
            if([name,email,password,age,mobile,gender].some((field) => 
                field?.trim() === "")
            ){
                res.render("register.ejs", {
                    errorMessage: "All fields are required."
                });
            }

            const existedUser = await User.findOne({
                $or: [{ mobile },{ email }] //check email or username
            })
    
            if(existedUser){
                res.render("register.ejs", {
                    errorMessage: "User with email or mobile is already exist."
                });
            }

            const user = await User.create({
                name, 
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
    res.render('home')
})

const Logout = asyncHandler(async(req,res) => {

    req.session.destroy((err) => {
        if (err) {
          return res.redirect('/user/home');
        }
        res.redirect('/user/login');
    });

})



export  {
    LoginPage,RegisterPage,HomePage,Logout
}