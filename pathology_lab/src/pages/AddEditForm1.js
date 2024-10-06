import { useEffect, useState } from "react";
import Report from "../backend/Report";

function NewEntryForm(){

    const [ patientData , setPatientData ] = useState({
        "Patient_ID" : 0,
        "Patient_Name" : "",
        "Age" : 0,
        "Gender" : "",
        "Reports" : [],
        "Total_Cost" : 0,
        "Due" : 0,
        "EntryDate" : "",
    });

    const [reportDataModified , setReportDataModified] = useState([]);
    useEffect( () => {
        const apiURL = "http://localhost:4522/reports";
        fetch( apiURL ).then( res => res.json() ).then( res => {
            let reportDataModified1 = res.map( ( report ) => {
                return(
                    <>
                        <div className = "form-check" >
                            <input className = "form-check-input" id={report.Report_ID + ""} type="checkbox" onClick ={ ( e ) => { changeReports( e , report.Report_ID , report.Price ) } }/>
                            <label className = "form-check-label" htmlFor = {report.Report_ID + ""}>
                                { report.Report_Name }
                            </label>
                        </div>
                    </>
                );
            } );
            setReportDataModified(reportDataModified1);
        } );
    } , [] );

    function changeReports( e , Report_ID , Price ){
        let Reports = patientData.Reports;
        let Total_Cost = patientData.Total_Cost;
        let Due = patientData.Due;
        console.log(patientData.Total_Cost);
        
        if( e.target.checked ){
            Reports.push( parseInt( Report_ID ) );
            Total_Cost = Total_Cost + Price;
            Due = Due + Price;
            setPatientData( { 
                ...patientData , 
                Reports : Reports , 
                Total_Cost : Total_Cost ,
                Due : Due
            } );
        }
        else{
            Reports.splice( Reports.indexOf( parseInt( Report_ID ) ) , 1 );
            Total_Cost = Total_Cost - Price;
            Due = Due - Price;
            setPatientData( { 
                ...patientData , 
                "Reports" : Reports , 
                "Total_Cost" : Total_Cost, 
                "Due" : Due
            } );
        }
    }
    return(
        <>
            <h1> { JSON.stringify( patientData ) } </h1>
            <div className = "container">
            <table className="table">
                <thead>
                    <tr>
                        <td colSpan={2}> <h1> New Patient Entry </h1> </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td> <label className= "form-label"> Entry Date </label></td>
                        <td>
                            <input className= "form-control" type="date" onChange={ ( e ) => {
                                    setPatientData( { ...patientData , "EntryDate" : e.target.value } );
                                }} />
                        </td>
                    </tr>

                    <tr>
                        <td> <label className= "form-label">Patient's Name</label> </td>
                        <td>
                            <input className= "form-control" onChange={ ( e ) => {
                                    setPatientData( { ...patientData , "Patient_Name" : e.target.value } );
                                }} />
                        </td>
                    </tr>
                    
                    <tr>
                        <td> <label className= "form-label"> Patient's Age </label> </td>
                        <td>
                            <input type = "number" className= "form-control" onChange={ ( e ) => {
                                    setPatientData( { ...patientData , "Age" : parseInt( e.target.value ) } );
                                }}/>
                        </td>
                    </tr>

                    <tr>
                        <td> Gender </td>
                        <td>
                            <select className = "form-select" onChange={ ( e ) => {
                                setPatientData( { ...patientData , "Gender" : e.target.value } )
                            } }>
                                <option value="default"> Select Gender </option>
                                <option value = "Male"> Male </option>
                                <option value = "Female"> Female </option>
                            </select>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div>
                <h1> Reports </h1>
                <div style={{ overflowY: "scroll" , height: 150+"%" }} className = "container">
                    { reportDataModified }
                </div>
            </div>
            </div>
        </>
    )
}

export default NewEntryForm;