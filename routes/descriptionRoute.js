const express = require("express");
const router = express.Router();
const Def = require("../models/definition")

router.route("/definitions").get((req, res) => {
    Def.find()
        .then(foundDef => res.json(foundDef))
})

module.exports = router;