const mongoose = require( 'mongoose' );

const schema = mongoose.Schema({
    "Report_ID" : Number,
    "Report_Name" : String,
    "Price" : Number
});

module.exports = mongoose.model("Report" , schema);