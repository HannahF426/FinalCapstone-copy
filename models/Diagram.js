const mongoose = require('mongoose');

// Schema
const Schema = mongoose.Schema;
const diagramSchema = new Schema({
    name: String,
    nodes: mongoose.Schema.Types.Mixed,
    definition: String
});

// Model
const Diagram = mongoose.model('Timing Diagrams', diagramSchema);

module.exports = Diagram;