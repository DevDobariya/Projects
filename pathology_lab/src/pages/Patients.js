import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";

function Patients(){
    const selectedDate = useOutletContext();
    const [ patientRecords , setPatientRecords ] = useState([]);

    let patientRecordsModified = patientRecords.map( ( patient , index ) => {
        return(
            <>
            <tr>
                <td> { index+1 } </td>
                <td> { patient.Patient_Name } </td>
                <td> <Link to= { "/editPatient/" + patient.Patient_ID } className="btn btn-primary"> Edit </Link> </td>
            </tr>
            </>
        );
    } );

    useEffect( () => {
        let Year = selectedDate.getFullYear();
        let Month= selectedDate.getMonth()+1;
        let Date = selectedDate.getDate();
        if( Month < 10 ) Month = "0" + Month;
        if( Date < 10 ) Date = "0" + Date;
        const apiURL = "http://localhost:4522/patients/"+Year+"-"+Month+"-"+Date;
        const options = {
            method : "GET"
        }
        fetch( apiURL , options ).then( res => res.json() ).then( res => setPatientRecords( res ) );
    } , [ selectedDate ] );

    return(
        <>
            <div style={{ width: "85%" , float: "left" , border: "1px solid black"}}>
                <div className="text-center"> <h1> Patients Registered Today </h1> </div>
                
                <div className="container">
                    <Link to="/newEntry" className="btn btn-primary"> +New Entry </Link>
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th> Sr No. </th>
                                <th> Patient Name </th>
                            </tr>
                        </thead>
                        <tbody>
                            { patientRecordsModified }
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default Patients;