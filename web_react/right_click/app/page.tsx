"use client"
import { useState } from "react";
import "./globals.css";
import customers from "../data/customers.json";

export default function Home() {

    return(
      <>

      <nav>
        <div className="navbar-left">
          <h1> <b> Right Click Assessment </b> </h1>
        </div>
      </nav>

      <div className="main">
        <h1> Welcome Back, Right Click! </h1>
        <Parse_Customers />
      </div>

      </>
    );
}

function Parse_Customers()
{
  const [showList, setShowList] = useState(false);

  return(
    <>
      <button type="button" className="btn" onClick={() => setShowList(!showList)}>
        {showList ? "Hide Customers" : "Show Customers"}
      </button>

      {showList && (
        <ul>
          {customers.map((customer) => (
            <li key={customer.id}> {customer.name} </li>
          ))}
        </ul>
      )}
    </>
  );
}
