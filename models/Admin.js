"use strict";

const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, min: 1, max: 100 },
    password: { type: String, required: true, min: 6, max: 100 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Admin", AdminSchema);