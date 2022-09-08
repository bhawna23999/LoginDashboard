const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const route = require('./routes/route.js');
const app = express();

app.use(bodyParser.json())


mongoose.connect("mongodb+srv://Bhawna_Agrawal:bhawnaagrawal@cluster0.zk2kv.mongodb.net/LoginDashboardTask?retryWrites=true&w=majority", {
    useNewUrlParser: true
})

.then( () => console.log("MongoDb is Connected"))
.catch(err => console.log(err))

app.use('/', route)

app.listen(process.env.PORT || 8000, function(){
    console.log('Express app running on port' + (process.env.PORT || 8000))
});