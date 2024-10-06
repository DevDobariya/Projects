const mongoose = require( 'mongoose' );

const schema = mongoose.Schema({
    "Patient_ID" : Number,
    "Patient_Name" : String,
    "Age" : Number,
    "Gender" : String,
    "Reports" : [ Number ],
    "Total_Cost" : Number,
    "Due" : Number,
    "EntryDate" : String,
});

module.exports = mongoose.model("Patient" , schema);