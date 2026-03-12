import { useRef, useState, useEffect } from "react";

function formatCurrency(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function Payroll({ user, employees }) {
  const isManager = user.role === "manager";

  const defaultRates = {
    Allan: 26,
    Lea: 32,
    Clara: 30,
    Tony: 30,
    Karim: 26,
  };

  const payrollData = employees.map((name) => ({
    name,
    hoursPerWeek: 43.5,
    hourlyRate: defaultRates[name] || 25,
  }));

  const visibleData = isManager
    ? payrollData
    : payrollData.filter((p) => p.name === user.name);

  const totalHours = visibleData.reduce((sum, p) => sum + p.hoursPerWeek, 0);
  const totalPayroll = visibleData.reduce((sum, p) => sum + p.hoursPerWeek * p.hourlyRate, 0);

  const currentEmployeeData = payrollData.find((p) => p.name === user.name);
  const monthlyHours =
    !isManager && currentEmployeeData ? currentEmployeeData.hoursPerWeek * 4.33 : null;

  const allEmployees = payrollData.map((p) => p.name);
  const [selectedEmployee, setSelectedEmployee] = useState(allEmployees[0]);

  const contractInputRef = useRef(null);
  const payslipInputRef = useRef(null);
  const ccntInputRef = useRef(null);

  const [employeeDocs, setEmployeeDocs] = useState({});

  // charger les documents depuis le navigateur (persistance simple)
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("employeeDocs");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === "object") {
          setEmployeeDocs(parsed);
        }
      }
    } catch (e) {
      // ignore erreurs de parsing
    }
  }, []);

  // sauvegarder les documents à chaque modification
  useEffect(() => {
    try {
      window.localStorage.setItem("employeeDocs", JSON.stringify(employeeDocs));
    } catch (e) {
      // ignore erreurs de stockage
    }
  }, [employeeDocs]);

  function handleFilesSelected(event, type) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const names = files.map((f) => f.name);
    setEmployeeDocs((prev) => {
      const current = prev[selectedEmployee] || {
        contract: [],
        payslip: [],
        ccnt: [],
      };
      return {
        ...prev,
        [selectedEmployee]: {
          ...current,
          [type]: [...current[type], ...names],
        },
      };
    });
  }

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginTop: 0, fontSize: "1.6rem", color: "#0f172a" }}>Préparation de paie</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        {isManager
          ? "Aperçu des heures, des coûts et des documents pour chaque employé."
          : "Espace documents pour ton dossier employé (contrat, fiches de salaire, CCNT)."}
      </p>
      
      {isManager && (
        <>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "white",
                padding: "16px 20px",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                minWidth: "220px",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "4px" }}>
                Heures totales (employés visibles)
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>{totalHours.toFixed(2)} h</div>
            </div>

            <div
              style={{
                background: "white",
                padding: "16px 20px",
                borderRadius: "12px",
                boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                minWidth: "220px",
              }}
            >
              <div style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "4px" }}>
                Masse salariale estimée
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                {formatCurrency(totalPayroll)}
              </div>
            </div>
          </div>

          <div
            style={{
              marginBottom: "16px",
              fontSize: "0.9rem",
              color: "#0f172a",
            }}
          >
            <span style={{ marginRight: "8px" }}>Sélection de l'employé :</span>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "1px solid #cbd5f5",
              }}
            >
              {allEmployees.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "14px 16px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "6px", fontSize: "0.95rem" }}>Contrats de travail</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", marginBottom: "10px" }}>
              PDF des contrats signés pour {selectedEmployee}.
            </p>
            <input
              ref={contractInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFilesSelected(e, "contract")}
            />
            <button
              type="button"
              style={{
                borderRadius: "999px",
                border: "1px solid #0f172a",
                background: "#0f172a",
                color: "white",
                padding: "6px 14px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
              onClick={() => contractInputRef.current && contractInputRef.current.click()}
            >
              Importer un contrat
            </button>
            {employeeDocs[selectedEmployee]?.contract?.length > 0 && (
              <ul
                style={{
                  marginTop: "10px",
                  paddingLeft: "18px",
                  fontSize: "0.8rem",
                  color: "#64748b",
                }}
              >
                {employeeDocs[selectedEmployee].contract.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            )}
          </div>

          <div
            style={{
              background: "white",
              padding: "14px 16px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "6px", fontSize: "0.95rem" }}>Fiches de salaire</h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", marginBottom: "10px" }}>
              Fiches de salaire mensuelles pour {selectedEmployee}.
            </p>
            <input
              ref={payslipInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFilesSelected(e, "payslip")}
            />
            <button
              type="button"
              style={{
                borderRadius: "999px",
                border: "1px solid #0f172a",
                background: "#0f172a",
                color: "white",
                padding: "6px 14px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
              onClick={() => payslipInputRef.current && payslipInputRef.current.click()}
            >
              Importer une fiche
            </button>
            {employeeDocs[selectedEmployee]?.payslip?.length > 0 && (
              <ul
                style={{
                  marginTop: "10px",
                  paddingLeft: "18px",
                  fontSize: "0.8rem",
                  color: "#64748b",
                }}
              >
                {employeeDocs[selectedEmployee].payslip.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            )}
          </div>

          <div
            style={{
              background: "white",
              padding: "14px 16px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "6px", fontSize: "0.95rem" }}>
              Heures & CCNT hôtellerie-restauration
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", marginBottom: "10px" }}>
              Documents de référence CCNT pour {selectedEmployee}.
            </p>
            <input
              ref={ccntInputRef}
              type="file"
              multiple
              style={{ display: "none" }}
              onChange={(e) => handleFilesSelected(e, "ccnt")}
            />
            <button
              type="button"
              style={{
                borderRadius: "999px",
                border: "1px solid #0f172a",
                background: "white",
                color: "#0f172a",
                padding: "6px 14px",
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
              onClick={() => ccntInputRef.current && ccntInputRef.current.click()}
            >
              Lier un document CCNT
            </button>
            {employeeDocs[selectedEmployee]?.ccnt?.length > 0 && (
              <ul
                style={{
                  marginTop: "10px",
                  paddingLeft: "18px",
                  fontSize: "0.8rem",
                  color: "#64748b",
                }}
              >
                {employeeDocs[selectedEmployee].ccnt.map((name, idx) => (
                  <li key={idx}>{name}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
        </>
      )}

      {isManager && (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            maxWidth: "800px",
            background: "white",
            boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#0f172a", color: "white" }}>
            <tr>
              <th style={{ padding: "10px 14px", textAlign: "left" }}>Employé</th>
              <th style={{ padding: "10px 14px", textAlign: "right" }}>Heures / semaine</th>
              <th style={{ padding: "10px 14px", textAlign: "right" }}>Taux horaire</th>
              <th style={{ padding: "10px 14px", textAlign: "right" }}>Brut estimé</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((p) => {
              const gross = p.hoursPerWeek * p.hourlyRate;
              return (
                <tr key={p.name}>
                  <td
                    style={{
                      padding: "10px 14px",
                      borderBottom: "1px solid #e2e8f0",
                      fontWeight: 500,
                    }}
                  >
                    {p.name}
                  </td>
                  <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>
                    {p.hoursPerWeek.toFixed(2)}
                  </td>
                  <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>
                    {formatCurrency(p.hourlyRate)}
                  </td>
                  <td style={{ padding: "10px 14px", borderBottom: "1px solid #e2e8f0", textAlign: "right" }}>
                    {formatCurrency(gross)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {!isManager && (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
          <div
            style={{
              background: "white",
              padding: "14px 18px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "6px", fontSize: "0.95rem" }}>
              Tes heures par mois
            </h3>
            {monthlyHours != null ? (
              <>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "#0f172a", marginBottom: "4px" }}>
                  Environ <strong>{monthlyHours.toFixed(1)} h</strong> / mois
                </p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                  Calcul basé sur ton contrat de 43.5 h / semaine (x 4.33 semaines).
                </p>
              </>
            ) : (
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                Aucune donnée d'heures trouvée pour ton profil.
              </p>
            )}
          </div>

          <div
            style={{
              background: "white",
              padding: "16px 18px",
              borderRadius: "12px",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <h3 style={{ margin: 0, marginBottom: "6px", fontSize: "0.95rem" }}>
              Tes documents employé
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748b", marginBottom: "8px" }}>
              Contrats, fiches de salaire et documents CCNT que ton manager a ajoutés pour toi.
            </p>
            {employeeDocs[user.name] ? (
              <ul
                style={{
                  marginTop: "4px",
                  paddingLeft: "18px",
                  fontSize: "0.85rem",
                  color: "#0f172a",
                }}
              >
                {["contract", "payslip", "ccnt"].map((type) =>
                  (employeeDocs[user.name][type] || []).map((name, idx) => (
                    <li key={`${type}-${idx}`}>
                      {type === "contract" && "Contrat : "}
                      {type === "payslip" && "Fiche de salaire : "}
                      {type === "ccnt" && "CCNT : "}
                      {name}
                    </li>
                  ))
                )}
              </ul>
            ) : (
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#94a3b8" }}>
                Aucun document n'a encore été ajouté pour toi.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Payroll;
