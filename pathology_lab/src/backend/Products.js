const mongoose = require( 'mongoose' );

const schema = mongoose.Schema({
    "Product_ID" : Number,
    "Product_Name" : String,
    "Product_Cost" : Number,
    "NoOfTests" : Number
} );

module.exports = mongoose.model("Products" , schema);