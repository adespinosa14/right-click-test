"use client"
import { useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import "./globals.css";
import customers from "../data/customers.json";
import { getQuickEstimate, getFullSystemEstimate, type Estimate } from "./estimator";

type Customer = typeof customers[number];

export default function Home() {
  return(
    <>
    <nav>
      <div className="navbar-left">
        <h1><b>Right Click Assessment</b></h1>
      </div>
    </nav>
    <div className="main">
      <h1>Welcome Back, Right Click! <ShowCustomers /></h1>
      <br />
    </div>
    </>
  );
}

function ShowCustomers() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  return (
    <>
      <button className="btn" onClick={() => setIsVisible(true)}>Show Customers</button>

      {/* Customer list modal */}
      {isVisible && (
        <div style={overlayStyle}>
          <div style={{ ...cardStyle, minWidth: "320px" }}>
            <div style={modalHeaderStyle}>
              <span style={{ fontWeight: 700, fontSize: "1rem" }}>Customers</span>
              <button style={closeButtonStyle} onClick={() => setIsVisible(false)}>✕</button>
            </div>
            <div style={{ padding: "1rem 1.25rem 1.25rem" }}>
              <CustomerList onSelect={(c) => { setSelectedCustomer(c); setIsVisible(false); }} />
            </div>
          </div>
        </div>
      )}

      {/* Customer profile modal */}
      {selectedCustomer && (
        <div style={overlayStyle}>
          <div style={{ ...cardStyle, minWidth: "440px", maxWidth: "90vw" }}>
            <div style={modalHeaderStyle}>
              <button
                style={{ background: "none", border: "none", cursor: "pointer", color: "#1a73e8", fontWeight: 600, fontSize: "0.875rem" }}
                onClick={() => { setSelectedCustomer(null); setIsVisible(true); }}
              >
                ← Back
              </button>
              <button style={closeButtonStyle} onClick={() => setSelectedCustomer(null)}>✕</button>
            </div>
            <CustomerProfile customer={selectedCustomer} />
          </div>
        </div>
      )}
    </>
  );
}

function CustomerList({ onSelect }: { onSelect: (c: Customer) => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {customers.map((customer) => (
        <button
          key={customer.id}
          type="button"
          onClick={() => onSelect(customer)}
          style={{
            width: "100%", textAlign: "left", padding: "0.625rem 0.875rem",
            border: "1px solid #e0e0e0", borderRadius: "6px", background: "white",
            cursor: "pointer", fontSize: "0.9rem", transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#f0f4ff")}
          onMouseLeave={e => (e.currentTarget.style.background = "white")}
        >
          <span style={{ fontWeight: 600 }}>{customer.name}</span>
          <span style={{ float: "right", fontSize: "0.75rem", color: "#888", textTransform: "capitalize" }}>
            {customer.propertyType ?? ""}
          </span>
        </button>
      ))}
    </div>
  );
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#999", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.4rem 0" }}>
        {label}
      </p>
      <div style={{ borderTop: "1px solid #eee", paddingTop: "0.5rem" }}>
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "0.25rem 0", gap: "1.5rem" }}>
      <span style={{ color: "#888", fontSize: "0.875rem", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: "0.875rem", textAlign: "right", textTransform: capitalize ? "capitalize" : "none" }}>{value}</span>
    </div>
  );
}

function EstimateRow({ estimate, isOpen, onToggle }: { estimate: Estimate; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ borderTop: "1px solid #e8e8e8", paddingTop: "0.6rem", marginTop: "0.6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.875rem", color: "#444" }}>{estimate.label}</span>
        <button onClick={onToggle}style={{ background: "none", border: "none", color: "#1a73e8", cursor: "pointer", fontWeight: 700, fontSize: "0.9rem", padding: 0 }} >
          ${estimate.total.toLocaleString()} {isOpen ? "▲" : "▼"}
        </button>
      </div>
      {isOpen && (
        <ul style={{ margin: "0.5rem 0 0", padding: "0 0 0 1rem", listStyle: "none" }}>
          {estimate.items.map((item, i) => (
            <li key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "#555", padding: "0.2rem 0" }}>
              <span>{item.description}</span>
              <span style={{ fontWeight: 600, marginLeft: "1rem", flexShrink: 0 }}>${item.cost.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CustomerProfile({ customer }: { customer: Customer }) {
  const [openBreakdown, setOpenBreakdown] = useState<string | null>(null);
  const quickEstimate = getQuickEstimate(customer);
  const fullEstimate = getFullSystemEstimate(customer);

  function toggleBreakdown(label: string) {
    setOpenBreakdown(prev => prev === label ? null : label);
  }

  return (
    <div>
      {/* Blue banner header */}
      <div style={{ background: "#1a73e8", color: "white", padding: "1.25rem 1.5rem" }}>
        <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 700 }}>{customer.name}</h2>
        <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.78rem", opacity: 0.8 }}>{customer.id}</span>
          {customer.propertyType && (
            <span style={{ background: "rgba(255,255,255,0.2)", padding: "2px 10px", borderRadius: "12px", fontSize: "0.72rem", textTransform: "capitalize" }}>
              {customer.propertyType}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "1.25rem 1.5rem 1.5rem" }}>
        <Section label="Contact">
          {customer.phone && <InfoRow label="Phone" value={customer.phone} />}
          {customer.address && <InfoRow label="Address" value={customer.address} />}
        </Section>

        <Section label="Property">
          <InfoRow label="Type" value={customer.propertyType ?? "—"} capitalize />
          {customer.squareFootage && <InfoRow label="Square Footage" value={`${customer.squareFootage.toLocaleString()} sq ft`} />}
        </Section>

        <Section label="System">
          <InfoRow label="Type" value={customer.systemType ?? "—"} />
          {customer.systemAge != null && <InfoRow label="Age" value={`${customer.systemAge} years`} />}
          {"lastServiceDate" in customer && customer.lastServiceDate && (
            <InfoRow label="Last Service" value={customer.lastServiceDate} />
          )}
        </Section>

        {/* Estimates card */}
        <div style={{ background: "#f5f7ff", border: "1px solid #e0e7ff", borderRadius: "8px", padding: "0.875rem 1rem" }}>
          <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6678b1", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 0.25rem 0" }}>
            Repair Estimates
          </p>
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
      </div>
    </div>
  );
}

// Shared modal styles
const overlayStyle: React.CSSProperties = {
  position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
};

const cardStyle: React.CSSProperties = {
  background: "white", borderRadius: "12px", maxHeight: "88vh",
  overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
};

const modalHeaderStyle: React.CSSProperties = {
  display: "flex", justifyContent: "space-between", alignItems: "center",
  padding: "0.75rem 1rem", borderBottom: "1px solid #eee",
  position: "sticky", top: 0, background: "white", zIndex: 1,
};

const closeButtonStyle: React.CSSProperties = {
  background: "none", border: "none", cursor: "pointer",
  color: "#999", fontSize: "1rem", fontWeight: 700, lineHeight: 1,
};
