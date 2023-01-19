const express = require('express');
const router = express.Router();
const userDiagram = require('../models/Userdata');
const Diagram = require('../models/Diagram');
const Test = require('../models/Test');
const util = require('util');
var create = require("../src/create");

router.get('/api', (req, res) => {
    
    Diagram.find({ })
        .then((data) => {
            console.log(JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(() => {
            console.log("error: ", daerrorta);
        });

});


router.post('/api/save', (req, res) => {
    
    // logs data to server console 
    console.log('Body: ', req.body);
    const data = req.body;
    const newTest = new Test(data);

    newTest.save((error) =>{
        if (error){
            res.status(500).json({ msg: 'Something went wrong saving data'})
        } else {
            res.json({
                msg: 'Your data has been saved'
            });
        }
    });
});



router.post('/api/userdata', (req, res) => {

    // logs data to server console
    console.log('Connections: ', req.body);
    const data = req.body;
    const diag = create.make_diagram(data.connections, data.chartName);
    const myDiagram = new userDiagram(diag);
    myDiagram.save((error) =>{
        if (error){
            res.status(500).json({ msg: '(HERE: router.post(\'/api/userdata\',)Something went wrong saving data'})
        } else {
            res.json({
                msg: "Your data has been saved"
            });

        }
    });
});

router.get('/api/userdata', (req, res) => {

    userDiagram.find({})
        .then((data) => {
            for(let adiagram of data) {
                if (adiagram.chartName === req.query.chartName) {
                    res.json(adiagram);
                }
            }
        })
        .catch(() => {
            console.log("error: ", daerrorta);
        });

});

router.get('/api/diagram', (req, res) => {

    Diagram.find({ name : "name"})
        .then((data) => {
            console.log(JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(() => {
            console.log("error: ", daerrorta);
        });

});

router.get('/api/test', (req, res) => {

    Test.find({ })
        .then((data) => {
            console.log(JSON.stringify(data, null, 2));
            res.json(data);
        })
        .catch(() => {
            console.log("error: ", daerrorta);
        });

});

module.exports = router;