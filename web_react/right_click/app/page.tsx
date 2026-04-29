"use client"
import { useState } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import customers from "../data/customers.json";
const CustomerMap = dynamic(() => import("./CustomerMap"), {ssr: false});

export default function Home() {
  return(
    <>

    <nav>
      <div className="navbar-left">
        <h1> <b> Right Click Assessment </b> </h1>
      </div>
    </nav>

    <div className="main">
      <h1> Welcome Back, Right Click! <ShowCustomers /></h1>
      <br />
      <CustomerMap />
    </div>
    </>
  );
}

function ShowCustomers()
{
  const [isVisible, setIsVisible] = useState(false);

  return(
    <>
      <button onClick={() => setIsVisible(true)}>Show Customers</button>
      {isVisible && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "8px", maxHeight: "80vh", overflowY: "auto", minWidth: "300px" }}>
            <button className="red_text" onClick={() => setIsVisible(false)}>Close</button>
            <br />
            <br />
            <CustomerList />
          </div>
        </div>
      )}
    </>
  );
}

function CustomerList()
{
  return(
    <>
      {customers.map((customer) =>(
        <>
          <button type="button" key={customer.id} className="flex justify-center btn buttons_center"> {customer.name} </button>
          <br />
          <br />
        </>
      ))}
    </>
  );
}
