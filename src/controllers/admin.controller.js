import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

const LoginPage = asyncHandler(async (req,res) => {

    if(req.method === 'POST'){

        try{

            //login with email or name with password
            const {email,username,password} = req.body

            if(!username && !email){
                res.render("admin/auth/login", {
                    errorMessage: "username or email is required."
                });
            }
        
            const user = await User.findOne({

                $and: [
                    { user_type: 'Admin' },
                    {
                      $or: [{ username },{ email }]
                    }
                  ]
            })

            //### findOne ye sab User modal k pass hai but jo custom method hai jaise isPasswrdCorret ye user k pass jai
            if(!user){
                res.render("admin/auth/login", {
                    errorMessage: "user does not exist."
                });
            }

            const isPassValid = await user.isPasswordCorrect(password) //paasword req.body vaala upar

            if(!isPassValid){
                res.render("admin/auth/login", {
                    errorMessage: "Password Incorrect."
                });
            }
            
            req.session.userId = user._id;
            req.session.user = user;//set user details in session so that we can access the value of user anywhere
            res.redirect('/admin/home');
            return

        }catch(error){
            res.render("admin/auth/login", {
                errorMessage: error
            });
        }

    }

    res.render('admin/auth/login');
})

const HomePage = asyncHandler(async(req,res) => {
    res.render('admin/dashboard');
})

const Logout = asyncHandler(async(req,res) => {
    req.session.destroy((err) => {
        if (err) {
          return res.redirect('/admin/home');
        }
        res.redirect('/admin/auth/login');
    });
})

export {
    LoginPage,HomePage,Logout
}