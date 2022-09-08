const jwt = require('jsonwebtoken')

const authentication = (req,res,next) => {
    try{
        let token =  req.headers['login-auth']
        // console.log(token)

        if(!token){
            res.status(400).send({status:false, message:'Missing authentication token in request'})
        }

        const decoded = jwt.verify(token, "LoginDashboardTask")
        // console.log(decoded)

        if(!decoded){
            return res.status(400).send({status:false , message:'Invalid authentication token in request'})
        }

        req.userId = decoded.userId
        // console.log(decoded.userId)
        // console.log(req.userId)

        next()

    }
    catch(err){
        res.status(500).send({status:false, Error:err.message})
    }
}

module.exports = {authentication}