import { useEffect, useState } from "react";
import { useOutletContext, useParams , useNavigate } from "react-router-dom";

function AddEditForm( { edit } ){

    const navigate = useNavigate();
    const params = useParams();
    const [ patientData , setPatientData ] = useState({
        "Patient_ID" : 0,
        "Patient_Name" : "",
        "Age" : 0,
        "Gender" : "",
        "Reports" : [],
        "Total_Cost" : 0,
        "Due" : 0,
        "EntryDate" : ""
    });

    const selectedDate = useOutletContext();
    const [ reportDataModified , setReportDataModified ] = useState([]);
    useEffect( () => {
        const apiURL = "http://localhost:4522/reports";
        fetch( apiURL ).then( res => res.json() ).then( res => {
            let reportDataModified1 = res.map( ( report ) => {
                return(
                    <>
                        <div className = "form-check">
                            <input className = "form-check-input" id={ "report_" + report.Report_ID } type="checkbox" onClick ={ ( e ) => { changeReports( e , report.Report_ID , report.Price ) } }/>
                            <label className = "form-check-label" htmlFor = {report.Report_ID + ""}>
                                { report.Report_Name }
                            </label>
                        </div>
                    </>
                );
            } );

            setReportDataModified(reportDataModified1);
            
            if( edit ){
                const patientURL = 'http://localhost:4522/patients/' + params.id;
                fetch( patientURL ).then( res => res.json() ).then( res => {
                    for( let key in patientData ){
                        patientData[ key ] = res[ key ];
                    }
                    document.getElementById( 'gender_select' ).value = res.Gender;
                    document.getElementById('name').value = res.Patient_Name;
                    document.getElementById('age').value = res.Age;
                    document.getElementById('total').value = res.Total_Cost;
                    document.getElementById('due').value = res.Due;
                    document.getElementById('paid').value = res.Total_Cost - res.Due;
                    let reports = res.Reports;
                    for( let i in reports ){
                        document.getElementById( 'report_' + reports[i] ).checked = true;
                    }
                    setPatientData( { ...patientData } );
                });
            }
        } );
    } , [] );

    useEffect( () => {
        let dateField = document.getElementById('date');
        let year = selectedDate.getFullYear();
        let month = ( selectedDate.getMonth()+1 );
        let date = selectedDate.getDate();
        
        if( date < 10 ) { date = "0" + date; }
        if( month < 10 ) { month = "0" + month }

        patientData.EntryDate = year + "-" + month + "-" + date;
        dateField.value = year + "-" + month + "-" + date;
        setPatientData( patientData );
    } , [ selectedDate ] );


    function changeReports( e , Report_ID , Price ){
        let Reports = patientData.Reports;

        if( e.target.checked ){
            Reports.push( parseInt( Report_ID ) );
            patientData.Total_Cost = patientData.Total_Cost + Price;
            patientData.Due = patientData.Due + Price;
            document.getElementById('total').value = patientData.Total_Cost;
            document.getElementById('due').value = patientData.Due;
            document.getElementById('paid').value = patientData.Total_Cost - patientData.Due;
            setPatientData( { 
                ...patientData , 
                "Reports" : Reports , 
                "Total_Cost" : patientData.Total_Cost ,
                "Due" : patientData.Due
            } );
        }
        else{
            Reports.splice( Reports.indexOf( parseInt( Report_ID ) ) , 1 );
            patientData.Total_Cost = patientData.Total_Cost - Price;
            patientData.Due = patientData.Due - Price;
            document.getElementById('total').value = patientData.Total_Cost;
            document.getElementById('due').value = patientData.Due;
            document.getElementById('paid').value = patientData.Total_Cost - patientData.Due;
            setPatientData( { 
                ...patientData , 
                "Reports" : Reports , 
                "Total_Cost" : patientData.Total_Cost, 
                "Due" : patientData.Due
            } );
        }
    }

    return(
        <>
        <div className = "container fs-5 w-50">
            <div className="row mb-3" >
                {  ( !edit ) && <h1> New Patient Entry </h1> }
                {  ( edit ) && <h1> Edit Patient Entry </h1> }
            </div>
            <div className="row" >
                <div className="col-6" > <label className= "form-label"> Entry Date </label> </div>
                <div className="col-6" >
                    <input className= "form-control" id="date" type="date" onChange={ ( e ) => {
                        patientData.EntryDate = e.target.value;
                        console.log(e.target.value + "" );
                        setPatientData( patientData );
                    }} />
                </div>
            </div>

            <div className="row" >
                <div className="col-6" > <label className= "form-label">Patient's Name</label> </div>
                <div className="col-6" >
                    <input className= "form-control" id="name" onChange={ ( e ) => {
                        patientData.Patient_Name = e.target.value;
                        setPatientData( patientData );
                    }}/>
                </div>
            </div>

            <div className="row" >
                <div className="col-6" > <label className= "form-label"> Patient's Age </label> </div>
                <div className="col-6" >
                    <input type = "number" id="age" className= "form-control" onChange={ ( e ) => {
                        patientData.Age = e.target.value;
                        setPatientData( patientData );
                    }} />
                </div>
            </div>

            <div className="row" >
                <div className="col-6" > <label className= "form-label"> Gender </label> </div>
                <div className="col-6" >
                    <select className = "form-select" onChange={ ( e ) => {
                        patientData.Gender = e.target.value;
                        setPatientData( patientData );
                    } } id="gender_select">
                        <option value="default"> Select Gender </option>
                        <option value = "Male"> Male </option>
                        <option value = "Female"> Female </option>
                    </select>
                </div>
            </div>
            
            <div className="row">
                <h1> Reports </h1>
                <div style={{ overflowY: "scroll", height: 150+"%" }} className = "container">
                    { reportDataModified }
                </div>
                <div className="container mt-5" >
                    <div className="row mb-5">
                        <div className = "input-group col">
                            <span className = "input-group-text" > Total(Rs): </span>
                            <input type="number" id="total" className = "form-control"/>
                        </div>
                        <div className = "input-group col">
                            <span className = "input-group-text" > Paid(Rs): </span>
                            <input type="number" id="paid" className = "form-control" onChange={ (e) => { 
                                let due = document.getElementById( 'due' );
                                due.value = patientData.Total_Cost - e.target.value;
                            } } />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <div className = "input-group">
                                <span className = "input-group-text" > Due (Rs): </span>
                                <input type="number" id="due" className = "form-control"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <button className="btn btn-primary" onClick={ async () => {
                    if( !edit ){
                        let paid = document.getElementById( 'paid' );
                        patientData.Due = patientData.Total_Cost - paid.value;
                        const sendDataUrl = "http://localhost:4522/patient/new";
                        let payload = await JSON.stringify( patientData );
                        console.log(payload);
                        
                        fetch( sendDataUrl , {
                            method : "POST",
                            body : payload,
                            headers : {
                                "Content-Type" : "Application/json"
                            }
                        } ).then( () => {
                            console.log("Data sent!");
                            navigate('/');
                        } );
                    }
                    else{
                        let paid = document.getElementById( 'paid' );
                        patientData.Due = patientData.Total_Cost - paid.value;
                        const sendDataUrl = "http://localhost:4522/patients/edit";
                        let payload = await JSON.stringify( patientData );
                        
                        fetch( sendDataUrl , {
                            method : "PATCH",
                            body : payload,
                            headers : {
                                "Content-Type" : "Application/json"
                            }
                        } ).then( () => {
                            navigate('/');
                        } );
                    }
                } } > Submit </button>

                { edit && <button className="btn btn-danger" onClick={ () => {
                    const deleteURL = 'http://localhost:4522/patients/' + patientData.Patient_ID;
                    fetch( deleteURL , { method : "DELETE" } ).then( () => {
                        setTimeout( () => { navigate("/") } , 500 );
                    } );
                } }> Delete Patient </button> }
            </div>
        </div>
        </>
    )
}

export default AddEditForm;