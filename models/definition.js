const mongoose = require("mongoose");

const defSchema = {
    name: String,
    nodes: Object,
    definition: String
}

const def = mongoose.model("Definition", defSchema);

module.exports = def;