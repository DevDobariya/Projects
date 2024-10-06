import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useState } from "react";

function Layout(){

    const [ selectedDate , setSelectedDate ] = useState( new Date() );

    return(
        <>
        <div className="container-fluid">
            <div className="row fs-4">
                < Navbar />
            </div>
            <div className="row mt-4">
                <div className="col-2">
                    <Sidebar setSelectedDate={ setSelectedDate } selectedDate={ selectedDate }/>
                </div>
                <div className="col" style={{ paddingLeft: "10%"}}>
                    <Outlet context={ selectedDate } />
                </div>
            </div>
        </div>
        </>
    );
}

export default Layout;