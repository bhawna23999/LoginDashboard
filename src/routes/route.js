const express = require('express')
const router = express.Router();
const userController = require('../controller/user')
const auth = require("../middleware/auth")


router.get("/test-me", function(req,res){
    res.send("My first api")
})

router.post("/create-User", userController.createUser);

router.get("/login-User", userController.loginUser);

router.get("/get-User/:userId" ,auth.authentication ,userController.getUser);


module.exports = router;