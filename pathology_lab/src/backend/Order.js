const mongoose = require( 'mongoose' );

const schema = mongoose.Schema({
    "Order_ID" : Number,
    "Product_ID": Number,
    "Amount" : Number,
    "Total_Cost" : Number,
    "Order_Date" : String
} );

module.exports = mongoose.model("Order" , schema);