import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

function OrderProduct(){
    const navigate = useNavigate();
    const selectedDate = useOutletContext();
    const [ cart , setCart ] = useState([]);
    const [ products , setProducts ] = useState([]);
    const [ productsModified , setProductsModified ] = useState([]);
    const [ cartModified , setCartModified ] = useState([]);

    useEffect( () => {
        let temp = products.map( ( element , index ) => {
            return(
                <>
                    <tr>
                        <td> { index+1 } </td>
                        <td> { element.Product_Name } </td>
                        <td> { element.Product_Cost } </td>
                        <td> { element.NoOfTests } </td>
                        <td> <button className="btn btn-primary" onClick={ () => {
                            const addToCart = {
                                ...element,
                                "Amount" : 1,
                                "Total_Cost" : element.Product_Cost,
                                "Order_Date" : selectedDate.getFullYear() + "-" + ( selectedDate.getMonth()+1 ) + "-" + selectedDate.getDate()
                            };
                            const updatedProducts = products.filter( product => element.Product_ID !== product.Product_ID );
                            // console.log( updatedProducts );
                            setProducts( updatedProducts );
                            setCart( [ ...cart , addToCart ] );
                        } } > Add to Cart </button> </td>
                    </tr>
                </>
            );
        } );
        // console.log( "useEffect: " , products );
        setProductsModified( temp );
    } , [ products ] );

    useEffect( () => {
        let updatedCart = cart.map( ( element , index ) => {
            return (
                <tr>
                    <td> { index + 1 } </td>
                    <td> { element.Product_Name } </td>
                    <td> { element.Product_Cost } </td>
                    <td> { element.NoOfTests } </td>
                    <td> <input className="form-control" defaultValue={element.Amount} min={0} type="number" onChange={ (e) => {
                        let temp = cart.map( obj => {
                            if( obj.Product_ID === element.Product_ID ){
                                return { ...obj , "Amount" : e.target.value , "Total_Cost" : e.target.value * obj.Product_Cost };
                            }
                            else{
                                return obj;
                            }
                        } );
                        setCart( temp );
                    } } /> </td>
                    <td> { element.Total_Cost } </td>
                    <td> <button className="btn btn-danger" onClick={ () => {
                        let updatedCart = cart.filter( obj => element.Product_ID !== obj.Product_ID );
                        let removedFromCart = {
                            "Product_ID" : element.Product_ID,
                            "Product_Name" : element.Product_Name,
                            "Product_Cost" : element.Product_Cost,
                            "NoOfTests" : element.NoOfTests
                        };
                        let updatedProducts = [ ... products , removedFromCart ];
                        updatedProducts = updatedProducts.sort( ( a , b ) => a.Product_ID - b.Product_ID );
                        setCart( updatedCart );
                        setProducts( updatedProducts );
                    } }> Remove </button> </td>
                </tr>
            );
        } );

        setCartModified( updatedCart );
    } , [ cart ] );

    useEffect( () => {
        const productsURL = "http://localhost:4522/products";        
        fetch( productsURL ).then( res => res.json() ).then( res => { setProducts( res ) } );
    } , [] );

    useEffect( () => {
        let date = selectedDate.getFullYear() + "-" + ( selectedDate.getMonth()+1 ) + "-" + selectedDate.getDate();
        let temp = cart.map( element => { return { ...element , "Order_Date" : date } } );
        setCart( temp );
    } , [ selectedDate ] )

    return(
        <>
            <div className="container fs-5">
                <h1> Cart </h1>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th> Sr. No </th>
                            <th> Product Name </th>
                            <th> Cost ( per unit ) </th>
                            <th> No of tests ( per unit ) </th>
                            <th> Amount of units </th>
                            <th> Total Cost </th>
                        </tr>
                    </thead>
                    <tbody>
                        { cartModified }
                        <tr>
                            <td colSpan={5} className="text-end"> <h2> Total Cost : </h2> </td>
                            <td> { cart.reduce( ( accumulator , obj ) => { return accumulator + obj.Total_Cost } , 0 ) } </td>
                        </tr>
                        { cart.length !== 0 &&
                            <tr>
                                <td colSpan={6}> <button className="btn btn-success w-100" onClick={ () => {
                                    let apiOrder = 'http://localhost:4522/orders';

                                    fetch( apiOrder , {
                                        method: "POST",
                                        body: JSON.stringify( cart ),
                                        headers: {
                                            'Content-Type': 'application/json'
                                        }
                                    } ).then( () => setTimeout( () => { navigate("/") } , 500 ) );
                                } }>  Place Order </button> </td>
                            </tr>
                        }
                    </tbody>
                </table>

                <h1 style={{ marginTop: "10%" }}> Products </h1>

                <table className="table table-striped">
                    <thead>
                            <tr>
                                <th> Sr. No </th>
                                <th> Product Name </th>
                                <th> Cost ( per unit ) </th>
                                <th> No of tests ( per unit ) </th>
                            </tr>
                    </thead>
                    
                    <tbody>
                        { productsModified }
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default OrderProduct;