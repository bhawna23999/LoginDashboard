const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')

const isValid = (value) => {
    if(typeof value == 'undefined' || value ===null) return false
    if(typeof value === 'string' && value.trim().length===0) return false
    return true
}

const isValidTitle = (title) => {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidRequestBody = (requestBody) => {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const createUser = async function(req,res){
    try
    {
        let requestBody = req.body

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message : 'Invalid request parameters. Please provide user details'})
        }

        //Extract Params
        let {fname, lname, title, email, password, phone} = requestBody

        if(!isValid(fname)){
            return res.status(400).send({status:false, message:'First name is required'})
        }

        if(!isValid(lname)){
            return res.status(400).send({status:false, message:'Last name is required'})
        }

        if(!isValid(title)){
            return res.status(400).send({status:false, message:'Title is required'})
        }
        //check for enum
        if(!isValidTitle(title)){
            return res.status(400).send({status:false, message: 'Title should be among Mr, Mrs, Miss'})
        }

        if(!isValid(email)){
            return res.status(400).send({status:false, message:'Email is required'})
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            return res.status(400).send({status:false, message:'Email should be valid email address'})
        }
        //check for valid email
        let isEmailAlreadyUsed = await userModel.findOne({email})
        //check for unique mail
        if(isEmailAlreadyUsed){
            return res.status(400).send({status:false, message:`${email} email address is already registered`})
        }

        if(!isValid(password)){
            return res.status(400).send({status:false, message:'Password is required'})
        }
        //check for password length
        if(!(password.length >= 8 && password.length <=15)){
            return res.status(400).send({status:false, message: 'Password should have length in range 8 to 15'})
        }
        
        if(!isValid(phone)){
            return res.status(400).send({status:false, message: ''})
        }
        //check for Natural no
        // if(!(!isNaN(Number(phone)))){
        //     return res.status(400).send({status:false, message:"Please enter only Natural no's"})
        // }
        // check for indian no
        if(!(/^[6-9]\d{9}$/.test(phone))){
            return res.status(400).send({status:false, msg:"This Number is not valid"})
        }
        //check for unique no
        let isPhoneNoAlreadyUsed = await userModel.findOne({phone})
        if(isPhoneNoAlreadyUsed){
            return res.status(400).send({status:false, message:`${phone} phone No is already registered`})
        }
        //Validation End

        const userData = {fname, lname, title, email, password, phone} 
        const newUser = await userModel.create(userData)
        res.status(201).send({status:true, message:'user created successfully', data:newUser})
    }
    catch(err){
        res.status(500).send({status:false, message: err.message})
    }
}


const loginUser = async function(req,res){
    try{

        let requestBody = req.body

        if(!isValidRequestBody(requestBody)){
            return res.status(400).send({status:false, message:'Invalid request parameters. Please provide login details'})
        }

        const {email, password} = requestBody

        if(!isValid(email)){
            return res.status(400).send({status:false, message : 'Email is required'})
        }
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))){
            return res.status(400).send({status:false, message:'Email should be valid email address'})
        }

        if(!isValid(password)){
            return res.status(400).send({status:false, message:'Password is required'})
        }
        if(!(password.length>=8 && password.length<=15)){
            return res.status(400).send({status:false, message:'Password should have length in range 8 to 15'})
        }

        let user = await userModel.findOne({email, password})

        if(!user){
            return res.status(400).send({status:false, message:'Invalid credentials'})
        }

        let userId = user._id

        let token = await jwt.sign(
            {
                userId : user._id,
                iat : Math.floor(Date.now()/1000),
                exp : Math.floor(Date.now()/1000+ 10 * 60 * 60)
            },
            "LoginDashboardTask"
        )

        res.header('login-auth', token);

        res.status(200).send({status:true, message:'User login Successfully', data: {userId, token}})

    }
    catch(err){
        res.status(500).send({status:false, message:err.message})
    }
}

const getUser = async function(req,res){
    try{
        let paramsId = req.params.userId

        //authentication
        if(req.userId != paramsId){
            return res.status(400).send({status:false, mesaage:'Invalid user'})
        }

        if(!isValidObjectId(paramsId)){
            return res.status(400).send({status:false, message: 'Invalid Params Id'})
        }

        let fetchProfileData = await userModel.findById(paramsId)
        // console.log(fetchProfileData)

        if(!fetchProfileData){
            return res.status(400).send({status:false, message:'User not found'})
        }

        res.status(200).send({status:true, message: 'User profile details' , data: fetchProfileData})
    }
    catch(err){
        res.status(500).send({status:false, Error:err.message} )
    }
}

module.exports = {createUser, loginUser, getUser}