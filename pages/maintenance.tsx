import React from "react";
import Head from "next/head";

const MaintenancePage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Maintenance - Twilight Struggle</title>
      </Head>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        padding: "2rem",
      }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Under Maintenance</h1>
        <p style={{ fontSize: "1.1rem", maxWidth: "480px", lineHeight: 1.6 }}>
          We&apos;re performing scheduled maintenance. The site will be back shortly.
          Thank you for your patience.
        </p>
      </div>
    </>
  );
};

export default MaintenancePage;
