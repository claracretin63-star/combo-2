import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "14px 32px",
        background: "white",
        color: "#0f172a",
        boxShadow: "0 10px 25px rgba(15,23,42,0.12)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          fontWeight: 700,
          letterSpacing: "0.06em",
          fontSize: "0.9rem",
          textTransform: "uppercase",
          color: "#0f4dcc",
        }}
      >
        Combo&nbsp;Lite
      </div>

      <div style={{ display: "flex", gap: "16px", fontSize: "0.95rem" }}>
        <Link
          to="/"
          style={{
            color: "#0f4dcc",
            textDecoration: "none",
            padding: "6px 10px",
            borderRadius: "999px",
            background: "rgba(15,77,204,0.06)",
          }}
        >
          Planning
        </Link>
        <Link
          to="/payroll"
          style={{
            color: "#0f4dcc",
            textDecoration: "none",
            padding: "6px 10px",
            borderRadius: "999px",
          }}
        >
          Salaires
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
