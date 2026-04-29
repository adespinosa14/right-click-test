"use client"
import { useState } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import customers from "../data/customers.json";
import { getQuickEstimate, getFullSystemEstimate, type Estimate } from "./estimator";
const CustomerMap = dynamic(() => import("./CustomerMap"), {ssr: false});

type Customer = typeof customers[number];

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
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  return(
    <>
      <button onClick={() => setIsVisible(true)}>Show Customers</button>

      {isVisible && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "8px", maxHeight: "80vh", overflowY: "auto", minWidth: "300px" }}>
            <button className="red_text" onClick={() => setIsVisible(false)}>Close</button>
            <br />
            <br />
            <CustomerList onSelect={(c) => { setSelectedCustomer(c); setIsVisible(false); }} />
          </div>
        </div>
      )}

      {selectedCustomer && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "8px", maxHeight: "80vh", overflowY: "auto", minWidth: "350px" }}>
            <button onClick={() => { setSelectedCustomer(null); setIsVisible(true); }}>← Back</button>
            <button className="red_text" style={{ marginLeft: "1rem" }} onClick={() => setSelectedCustomer(null)}>Close</button>
            <CustomerProfile customer={selectedCustomer} />
          </div>
        </div>
      )}
    </>
  );
}

function CustomerList({ onSelect }: { onSelect: (c: Customer) => void })
{
  return(
    <>
      {customers.map((customer) =>(
        <div key={customer.id}>
          <button type="button" className="flex justify-center btn buttons_center" onClick={() => onSelect(customer)}>
            {customer.name}
          </button>
          <br />
          <br />
        </div>
      ))}
    </>
  );
}

function EstimateRow({
  estimate,
  isOpen,
  onToggle,
}: {
  estimate: Estimate;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div style={{ marginTop: "0.5rem" }}>
      <p>
        <b>{estimate.label}:</b>{" "}
        <button
          onClick={onToggle}
          style={{ background: "none", border: "none", color: "#1a73e8", cursor: "pointer", textDecoration: "underline", fontWeight: "bold", padding: 0 }}
        >
          ${estimate.total.toLocaleString()}
        </button>
      </p>
      {isOpen && (
        <ul style={{ marginTop: "0.25rem", paddingLeft: "1.25rem", fontSize: "0.875rem", color: "#444" }}>
          {estimate.items.map((item, i) => (
            <li key={i}>{item.description} — <b>${item.cost.toLocaleString()}</b></li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CustomerProfile({ customer }: { customer: Customer })
{
  const [openBreakdown, setOpenBreakdown] = useState<string | null>(null);
  const quickEstimate = getQuickEstimate(customer);
  const fullEstimate = getFullSystemEstimate(customer);

  function toggleBreakdown(label: string) {
    setOpenBreakdown(prev => prev === label ? null : label);
  }

  return(
    <div style={{ marginTop: "1rem" }}>
      <h2><b>{customer.name}</b></h2>
      <br />
      <p><b>ID:</b> {customer.id}</p>
      <p><b>Phone:</b> {customer.phone}</p>
      <p><b>Address:</b> {customer.address}</p>
      <p><b>Property Type:</b> {customer.propertyType}</p>
      {customer.squareFootage && <p><b>Square Footage:</b> {customer.squareFootage.toLocaleString()} sq ft</p>}
      <p><b>System Type:</b> {customer.systemType}</p>
      <p><b>System Age:</b> {customer.systemAge} years</p>
      {"lastServiceDate" in customer && (
        <p><b>Last Service Date:</b> {customer.lastServiceDate}</p>
      )}
      <EstimateRow
        estimate={quickEstimate}
        isOpen={openBreakdown === quickEstimate.label}
        onToggle={() => toggleBreakdown(quickEstimate.label)}
      />
      <EstimateRow
        estimate={fullEstimate}
        isOpen={openBreakdown === fullEstimate.label}
        onToggle={() => toggleBreakdown(fullEstimate.label)}
      />
    </div>
  );
}
