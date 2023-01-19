const mongoose = require('mongoose');


// Schema
const userSchema = mongoose.Schema;
const userdataSchema = new userSchema({
    chartName: String,
    diagram: mongoose.Schema.Types.Mixed,
    results: Array
});

// Model
const Userdata = mongoose.model('Userdata', userdataSchema);

module.exports = Userdata;