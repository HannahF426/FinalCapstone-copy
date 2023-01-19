const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.json());

const routes = require('./routes/api');

mongoose.connect("mongodb+srv://CCraven:Asdfghjkl12@cluster0.inuhw.mongodb.net/Capstone");
mongoose.connection.on('connected', () => {
    console.log("Mongoose is connected");
})


// Saving data
const data = {
    title: "This is a test",
    body: "I guess it worked"
};

//const newTestSave = new Test(data);

/*
newTestSave.save((error) => {
    if (error) {
        console.log("There was an error saving :( ");
    }
    else {
        console.log('Data has been saved :)');
    }
});
*/

app.use(cors());

app.use(express.json());
// TODO: change this to true when wanting to use the nested object
app.use(express.urlencoded({extended: true}));

// HTTP request logger
//app.use(morgan('tiny'));
app.use("/", routes);


app.listen(3050, function(){
    console.log("express server is running on port 3050");
});