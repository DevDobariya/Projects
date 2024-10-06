const express = require('express');
const mongoose = require('mongoose');
const env = require('dotenv').config( { path : "../../.env" } );
const bodyParser = require('body-parser');
const cors = require('cors');
const Order = require('./Order');
const Patient = require('./Patient');
const Report = require('./Report');
const Products = require('./Products');
const connectionString = "mongodb+srv://" + process.env.MongoUser + ":" + process.env.MongoPassword + "@cluster0.mvkai.mongodb.net/Pathology_Lab";

mongoose.connect( connectionString).then( () => {
    const app = express();
    app.use( cors() );
    app.use( express.json() );
    app.use( bodyParser.json() );

    app.get( '/reports' , async ( req , res ) => {
        const reports = await Report.find().sort( { "Report_ID" : 1 } );
        res.json( reports );
    } );

    app.get( '/products' , async ( req , res ) => {
        const products = await Products.find().sort( { "Product_ID" : 1 } ).select('-_id');
        res.json( products );
    } );

    app.get( '/patients/:year-:month-:date' , async ( req , res ) => {
        let fullDate = req.params.year + "-" + req.params.month + "-" + req.params.date;
        const ans = await Patient.find( { "EntryDate" : fullDate } );
        res.json(ans);
    } );

    app.get( '/patients/month/:year-:month' , async ( req , res ) => {
        const regexp = new RegExp( req.params.year + "-" + req.params.month + "-" );
        const ans = await Patient.find( { "EntryDate" : regexp } );
        res.json( ans );
    } );

    app.get( '/patients' , async ( req , res ) => {
        const patients = await Patient.find();
        res.json( patients );
    } );

    app.get( '/patients/:id' , async ( req , res ) => {
        const patient = await Patient.findOne( { "Patient_ID" : req.params.id } );
        res.json( patient );
    } );
    
    app.post( '/patient/new' , async ( req , res ) => {
        const newPatient = new Patient( { ...req.body } );
        const temp = await Patient.find().sort( { "Patient_ID" : -1 } ).limit(1);
        if( temp.length === 0 ){
            newPatient.Patient_ID = 1;
        }
        else{
            newPatient.Patient_ID = temp[0].Patient_ID+1;
        }
        const ans = await newPatient.save();
        res.json( true );
    } );

    app.patch( '/patients/edit' , async ( req , res ) => {
        const patient = await Patient.findOneAndUpdate( { "Patient_ID" : req.body.Patient_ID } , req.body );
        res.json( true );
    } );

    app.delete( '/patients/:id' , async ( req , res ) => {
        const patient = await Patient.deleteOne( { "Patient_ID" : req.params.id } );
        res.json( patient );
    } );

    app.get( '/orders' , async ( req , res ) => {
        const orders = await Order.find();
        res.json( orders );
    } );

    app.get( '/orders/month/:year-:month' , async ( req , res ) => {
        const regexp = new RegExp( req.params.year + "-" + req.params.month + "-" );
        const ans = await Order.find( { "Order_Date" : regexp } );
        res.json( ans );
    } )

    app.post( '/orders' , async ( req , res ) => {
        const temp = await Order.find().sort( { "Order_ID" : -1 } ).limit(1);
        let lastOrderID = 0;
        if( temp.length !== 0 ){
            lastOrderID = temp[0].Order_ID;
        }
        const newOrders = req.body;
        for( let i in newOrders ){
            lastOrderID++;
            let temp = await new Order( { ...req.body[i] , "Order_ID" : lastOrderID } );
            await temp.save();
        }
        res.json( true );
    } );

    app.listen( 4522 , () => {
        console.log("Server Started");
    } )
} );