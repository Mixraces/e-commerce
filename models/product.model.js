const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true},
    price: {type: Number, required: true},
    description: {type: String, required: true},
    category: {type: String},
    imageUrl: {type: String, required: true}
})

const ProductModel = mongoose.model("Product", ProductSchema);
module.exports = ProductModel;