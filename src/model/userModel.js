
const mongoose =  require('mongoose')


const userSchema = new mongoose.Schema({

    fname : {type:String, required:true, trim:true},

    lname : {type:String, required:true, trim:true},

    title : {type:String, required:true, enum:["Mr", "Mrs", "Miss"]},

    email : {type:String, required:true, unique:true},

    password : {type:String, required:true, minLength :8, maxLength :15},

    phone : {type:String, required:true, unique:true}

},{timestamps:true})

module.exports = mongoose.model('Login', userSchema)