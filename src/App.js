import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Navbar from "./Navbar";
import Planning from "./Planning";
import Payroll from "./Payroll";

const INITIAL_EMPLOYEES = ["Allan", "Lea", "Clara", "Tony", "Karim"];
const INITIAL_PINS = {
  Allan: "1111",
  Lea: "2222",
  Clara: "3333",
  Tony: "4444",
  Karim: "5555",
};
const MANAGER_CODE = "C&T"; // code très simple, juste pour la démo

function Login({ onLogin, employees, employeePins }) {
  const [mode, setMode] = useState("employee"); // "employee" ou "manager"
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (mode === "employee") {
      if (!employees.includes(name)) {
        setError("Cet employé n'existe pas dans la démo.");
        return;
      }
      const expectedPin = employeePins[name];
      if (!expectedPin || pin !== expectedPin) {
        setError("Code personnel incorrect pour cet employé.");
        return;
      }
      onLogin({ role: "employee", name });
    } else {
      if (code !== MANAGER_CODE) {
        setError("Code manager incorrect.");
        return;
      }
      onLogin({ role: "manager", name: "Manager" });
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
        padding: "20px",
      }}
    >
      <div
        style={{
          background: "white",
          padding: "28px 24px",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 40px rgba(15,23,42,0.35)",
        }}
      >
        <h2 style={{ marginTop: 0, marginBottom: "4px" }}>Connexion</h2>
        <p style={{ marginTop: 0, marginBottom: "18px", color: "#64748b", fontSize: "0.9rem" }}>
          Choisis si tu te connectes en tant qu'employé ou manager.
        </p>

        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "18px",
            background: "#e2e8f0",
            padding: "3px",
            borderRadius: "999px",
          }}
        >
          <button
            type="button"
            onClick={() => setMode("employee")}
            style={{
              flex: 1,
              border: "none",
              borderRadius: "999px",
              padding: "8px 0",
              cursor: "pointer",
              background: mode === "employee" ? "white" : "transparent",
              fontWeight: 600,
            }}
          >
            Employé
          </button>
          <button
            type="button"
            onClick={() => setMode("manager")}
            style={{
              flex: 1,
              border: "none",
              borderRadius: "999px",
              padding: "8px 0",
              cursor: "pointer",
              background: mode === "manager" ? "white" : "transparent",
              fontWeight: 600,
            }}
          >
            Manager
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "employee" ? (
            <>
              <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Nom de l'employé
                <select
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    marginTop: "6px",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5f5",
                  }}
                >
                  <option value="">Sélectionner...</option>
                  {employees.map((emp) => (
                    <option key={emp} value={emp}>
                      {emp}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
                Code personnel
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="ex: 4 chiffres"
                  style={{
                    width: "100%",
                    marginTop: "6px",
                    padding: "8px 10px",
                    borderRadius: "8px",
                    border: "1px solid #cbd5f5",
                  }}
                />
              </label>
            </>
          ) : (
            <label style={{ fontSize: "0.9rem", fontWeight: 500 }}>
              Code manager
              <input
                type="password"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: "100%",
                  marginTop: "6px",
                  padding: "8px 10px",
                  borderRadius: "8px",
                  border: "1px solid #cbd5f5",
                }}
              />
            </label>
          )}

          {error && (
            <div style={{ color: "#b91c1c", fontSize: "0.85rem" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            style={{
              marginTop: "6px",
              background: "#0f172a",
              color: "white",
              border: "none",
              borderRadius: "999px",
              padding: "10px 0",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null); // { role: "employee" | "manager", name: string }
  const [employees, setEmployees] = useState(INITIAL_EMPLOYEES);
  const [employeePins, setEmployeePins] = useState(INITIAL_PINS);

  if (!user) {
    return <Login onLogin={setUser} employees={employees} employeePins={employeePins} />;
  }

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <Planning
              user={user}
              employees={employees}
              onAddEmployee={(rawName) => {
                const name = rawName && rawName.trim();
                if (!name) return;
                setEmployees((prev) => (prev.includes(name) ? prev : [...prev, name]));
                const pin = window.prompt(
                  `Code personnel (PIN) pour ${name} (ex: 4 chiffres) :`,
                  ""
                );
                if (pin) {
                  setEmployeePins((prev) => ({ ...prev, [name]: pin }));
                }
              }}
              onRemoveEmployee={(name) => {
                setEmployees((prev) => prev.filter((emp) => emp !== name));
                setEmployeePins((prev) => {
                  const { [name]: _removed, ...rest } = prev;
                  return rest;
                });
              }}
            />
          }
        />
        <Route path="/payroll" element={<Payroll user={user} employees={employees} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;