import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { QueryTypes } from "../models/query_types.model.js";
import { Feedback } from "../models/feedback.model.js";

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

    const totalUsers = await User.countDocuments({ user_type: 'User' });
    res.render('admin/dashboard', { users: totalUsers });
})

const Logout = asyncHandler(async(req,res) => {
    req.session.destroy((err) => {
        if (err) {
          return res.redirect('/admin/home');
        }
        res.redirect('/admin/login');
    });
})

const PatientList = asyncHandler(async(req,res) => {

    try{

        const PatinetDetails = await User.find({ user_type: 'User' });
        res.render('admin/patient/list', { patients: PatinetDetails });


    }catch(error){

        res.render("admin/patient/list", {
            errorMessage: error
        });
    }

})

const PatientQueryList = asyncHandler(async(req,res) => {

    try{

        const feedbacks = await Feedback.find({ is_deleted: '0' });
        const query_types = await QueryTypes.find({ is_deleted: '0' });
        res.render('admin/patient_query/list',{ feedbacks: feedbacks,query_types:query_types });

    }catch(error){
        res.render("admin/patient_query/list", {
            errorMessage: error
        });
    }

})

const queryList = asyncHandler(async(req,res) => {
    try{


        const query_list = await QueryTypes.find({ is_deleted: '0' });
        res.render('admin/query/list', { query_list: query_list });

    }catch(error){
        res.render("admin/query/list", {
            errorMessage: error
        });
    }
})

const addQuery = asyncHandler(async(req,res) => {
    try{

        const {name} = req.body
        const existDept = await QueryTypes.findOne({ name: name });

        if(existDept){
            res.json({
                message: "This name already exist in db"
            });
        }

        const queryTypes = await QueryTypes.create({
            name
        })

        //check data is created
        const Createddept = await QueryTypes.findById(queryTypes._id)

        if(!Createddept){
            res.json({
                message: "Something went wrong to create a query",
                status:false
            });
        }

        
        res.json({
            message: "query has been created.",
            status:true
        });

    }catch(error){
        res.json({
            message: error,
            status:false
        });
    }
})

const deleteQuery = asyncHandler(async(req,res) => {

    try{

        const {id} = req.body
        
        const updateQuery = await QueryTypes.findByIdAndUpdate(
            id,
            {
                //jo field hme set karna hai
                $set:{
                    is_deleted:true,
                }
            },
            {new:true}//return updated document
        )

        if (updateQuery) {
            res.json({
                message: "deleted",
                status:true
            });
        } else {
            res.json({
                message: "something wrong.",
                status:false
            });
        }

    }catch(error){
        res.json({
            message: "sddsd",
            status:false
        });
    }

})

const updateQuery = asyncHandler(async(req,res) => {

    try{

        const {query_id,query_name} = req.body

        const updateQuery = await QueryTypes.findByIdAndUpdate(
            query_id,
            {
                //jo field hme set karna hai
                $set:{
                    name:query_name,
                }
            },
            {new:true}//return updated document
        )

        if (updateQuery) {
            res.json({
                message: "updated",
                status:true
            });
        } else {
            res.json({
                message: "something wrong.",
                status:false
            });
        }

    }catch(error){
        res.json({  
            message: "something went wrong.",
            status:false
        });
    }

})

const PatientResetPassword = asyncHandler(async(req,res) => {

    if(req.method === 'POST'){

        const {email,password} = req.body

        const emailExist = await User.findOne({ email: email });
        if(emailExist){
            res.render("admin/query/patient-reset-password", {
                errorMessage: "This email not exist in db."
            });
        }

    }

    res.render('admin/patient/reset-password');
})

const updateDept = asyncHandler(async(req,res) => {

    try{

        const {feedback_id,dept_id} = req.body

        const updateQuery = await Feedback.findByIdAndUpdate(
            {
                _id:feedback_id
            },
            {
                //jo field hme set karna hai
                $set:{
                    query_type_id:dept_id,
                }
            },
            {new:true}//return updated document
        )

        if (updateQuery) {
            res.json({
                message: "updated",
                status:true
            });
        } else {
            res.json({
                message: "something wrong.",
                status:false
            });
        }

    }catch(error){
        res.json({  
            message: error,
            status:false
        });
    }

})

const reply = asyncHandler(async(req,res) => {

    try{

        const {id,message,query_type_id} = req.body

        const updateQuery = await Feedback.findByIdAndUpdate(
            id,
            {
                //jo field hme set karna hai
                $set:{
                    message_reply_by_admin:message,
                    is_reply:"yes",
                    query_type_id:query_type_id
                }
            },
            {new:true}//return updated document
        )

        if (updateQuery) {
            res.json({
                message: "updated",
                status:true
            });
        } else {
            res.json({
                message: "something wrong.",
                status:false
            });
        }

    }catch(error){
        res.json({  
            message: error,
            status:false
        });
    }

})

export {
    LoginPage,HomePage,Logout,PatientList,PatientQueryList,queryList,addQuery,deleteQuery,updateQuery,PatientResetPassword,updateDept,reply
}