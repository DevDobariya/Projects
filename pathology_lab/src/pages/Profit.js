import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";

function Profit(){
    
    const selectedDate = useOutletContext();
    const [ patients , setPatients ] = useState([]);
    const [ orders , setOrders ] = useState([]);
    const [ products , setProducts ] = useState([]);
    const [ selectedMonth , setSelectedMonth ] = useState( ( selectedDate.getMonth() + 1 )+ "");
    const [ selectedYear , setSelectedYear ] = useState( selectedDate.getFullYear() + "");

    useEffect( () => {
        const productsAPI = "http://localhost:4522/products";
        fetch( productsAPI ).then( res => res.json() ).then( res => setProducts( res ) );
    } , [] );

    useEffect( () => {
        const patientsAPI = "http://localhost:4522/patients/month/" + selectedYear + "-" + selectedMonth;
        const ordersAPI = "http://localhost:4522/orders/month/" + selectedYear + "-" + selectedMonth;

        fetch( patientsAPI ).then( res => res.json() ).then( res => setPatients( res ) );
        fetch( ordersAPI ).then( res => res.json() ).then( res => setOrders( res ) );
    }, [ selectedMonth , selectedYear ] );

    useEffect( () => {
        let patientTotal = patients.reduce( ( acc , patient ) => acc + patient.Total_Cost , 0 );
        let orderTotal = orders.reduce( ( acc , order ) => acc + order.Total_Cost , 0 );
        document.getElementById('total_profit').innerHTML = "₹"+( patientTotal - orderTotal );
    } , [ patients , orders ] );

    const patientsModified = patients.map( ( element , index ) => {
        return(
            <>
                <tr>
                    <td> { index + 1 } </td>
                    <td> { element.Patient_Name } </td>
                    <td> { "₹" + element.Total_Cost } </td>
                </tr>
            </>
        );
    } );

    const ordersModified = orders.map( ( element , index ) => {
        return(
            <>
                <tr>
                    <td> { index + 1 } </td>
                    <td> { products[ element.Product_ID - 1 ].Product_Name } </td>
                    <td> { element.Amount } </td>
                    <td> { "₹" + element.Total_Cost } </td>
                </tr>
            </>
        );
    } )

    return(
        <>
            <div className="container fs-5">
                <div className="row mb-5">
                    <div className="col">
                        <h3> Choose Month: </h3>
                        <select className="form-select fs-5 fw-bold" defaultValue={ selectedMonth } onChange={ (e) => { setSelectedMonth( e.target.value ) } } >
                            <option value="0"> Select Month </option>
                            <option value="01">January</option>
                            <option value="02">February</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                    </div>

                    <div className="col">
                        <h3> Choose Year: </h3>
                        <select className="form-select fs-5 fw-bold" defaultValue={ selectedYear } onChange={ (e) => { setSelectedYear( e.target.value ) } }>
                            <option value="2005">2005</option>
                            <option value="2006">2006</option>
                            <option value="2007">2007</option>
                            <option value="2008">2008</option>
                            <option value="2009">2009</option>
                            <option value="2010">2010</option>
                            <option value="2011">2011</option>
                            <option value="2012">2012</option>
                            <option value="2013">2013</option>
                            <option value="2014">2014</option>
                            <option value="2015">2015</option>
                            <option value="2016">2016</option>
                            <option value="2017">2017</option>
                            <option value="2018">2018</option>
                            <option value="2019">2019</option>
                            <option value="2020">2020</option>
                            <option value="2021">2021</option>
                            <option value="2022">2022</option>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                        </select>
                    </div>
                </div>
                
                <div className="row mb-5">
                    <h1> Patients this month </h1>
                    <table className="table table-striped table-hover">
                        <thead>
                            <th> Sr. No </th>
                            <th> Patient Name </th>
                            <th> Collection </th>
                        </thead>

                        <tbody> { patientsModified } </tbody>
                    </table>
                </div>

                <div className="row">
                    <h1> Products ordered this month </h1>
                    <table className="table table-striped table-hover">
                        <thead>
                            <th> Sr. No</th>
                            <th> Product </th>
                            <th> Units Ordered </th>
                            <th> Total Cost </th>
                        </thead>

                        <tbody> { ordersModified } </tbody>
                    </table>
                </div>

                <div className="row">
                    <div className="col" >
                        <h1> Total Profit: </h1>
                    </div>

                    <div className="col" id="total_profit"></div>
                </div>
            </div>
        </>
    );
}

export default Profit;