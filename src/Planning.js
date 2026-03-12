import React, { useState } from "react";

const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

// planning très simple : on vise ~43.5 h par semaine
// Allan : service midi + soir sur 5 jours
// Lea : journée continue cuisine
// Tony : soir + week-end
// Karim : coupure + week-end
const initialShifts = [
  // Allan (employé polyvalent)
  { employee: "Allan", day: "Lundi",    shift: "10:00 - 14:30 / 18:00 - 22:00" },
  { employee: "Allan", day: "Mardi",    shift: "10:00 - 14:30 / 18:00 - 22:00" },
  { employee: "Allan", day: "Jeudi",    shift: "10:00 - 14:30 / 18:00 - 22:00" },
  { employee: "Allan", day: "Vendredi", shift: "10:00 - 14:30 / 18:00 - 22:00" },
  { employee: "Allan", day: "Samedi",   shift: "11:00 - 15:00 / 18:00 - 22:30" },

  // Lea (employée polyvalente)
  { employee: "Lea", day: "Lundi",    shift: "08:00 - 17:30" },
  { employee: "Lea", day: "Mardi",    shift: "08:00 - 17:30" },
  { employee: "Lea", day: "Jeudi",    shift: "08:00 - 17:30" },
  { employee: "Lea", day: "Vendredi", shift: "08:00 - 17:30" },
  { employee: "Lea", day: "Samedi",   shift: "09:00 - 14:00 / 18:00 - 22:00" },

  // Clara (directrice / responsable salle)
  { employee: "Clara", day: "Mardi",    shift: "11:00 - 15:00 / 18:00 - 22:30" },
  { employee: "Clara", day: "Mercredi", shift: "11:00 - 15:00 / 18:00 - 22:30" },
  { employee: "Clara", day: "Vendredi", shift: "11:00 - 15:00 / 18:00 - 22:30" },
  { employee: "Clara", day: "Samedi",   shift: "11:00 - 15:00 / 18:00 - 23:00" },
  { employee: "Clara", day: "Dimanche", shift: "11:00 - 16:00" },

  // Tony (chef de cuisine)
  { employee: "Tony", day: "Mardi",    shift: "11:00 - 15:00 / 18:00 - 22:30" },
  { employee: "Tony", day: "Mercredi", shift: "11:00 - 15:00 / 18:00 - 22:30" },
  { employee: "Tony", day: "Vendredi", shift: "11:00 - 15:00 / 18:00 - 22:30" },
  { employee: "Tony", day: "Samedi",   shift: "11:00 - 15:00 / 18:00 - 23:00" },
  { employee: "Tony", day: "Dimanche", shift: "11:00 - 16:00" },

  // Karim (chef de partie cuisine)
  { employee: "Karim", day: "Mercredi", shift: "10:30 - 14:30 / 18:00 - 22:00" },
  { employee: "Karim", day: "Jeudi",    shift: "10:30 - 14:30 / 18:00 - 22:00" },
  { employee: "Karim", day: "Vendredi", shift: "10:30 - 14:30 / 18:00 - 22:30" },
  { employee: "Karim", day: "Samedi",   shift: "11:00 - 15:00 / 18:00 - 22:30" },
  { employee: "Karim", day: "Dimanche", shift: "11:00 - 16:00" },
];

// configuration simple des types de jour pour la couleur (par défaut)
// "work" = travail (bleu clair), "off" = repos, "holiday" = jour férié, "vacation" = vacances
const dayTypes = {
  Lundi: "work",
  Mardi: "work",
  Mercredi: "work",
  Jeudi: "work",
  Vendredi: "work",
  Samedi: "work",
  Dimanche: "off", // par défaut repos pour l'exemple
};

// statut spécifique initial par employé / jour
// ici : Clara & Tony en congés (vacances) lundi et mardi, jeudi jour férié pour eux
const initialEmployeeDayStatus = {
  Clara: {
    Lundi: "vacation",
    Mardi: "vacation",
    Jeudi: "holiday",
  },
  Tony: {
    Lundi: "vacation",
    Mardi: "vacation",
    Jeudi: "holiday",
  },
};

function parseTimeToHours(timeStr) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours + minutes / 60;
}

// "10:00 - 14:30 / 18:00 - 22:00" -> total heures du/des créneaux
function getShiftHours(shiftString) {
  if (!shiftString || shiftString === "-") return 0;

  return shiftString
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((sum, part) => {
      const [start, end] = part.split("-").map((t) => t.trim());
      return sum + (parseTimeToHours(end) - parseTimeToHours(start));
    }, 0);
}

function getShift(shiftsData, employee, day) {
  const s = shiftsData.find((shift) => shift.employee === employee && shift.day === day);
  return s ? s.shift : "-";
}

function splitShift(shiftString) {
  if (!shiftString || shiftString === "-") {
    return { morning: "", afternoon: "" };
  }
  const parts = shiftString.split("/").map((p) => p.trim());
  if (parts.length === 1) {
    return { morning: parts[0], afternoon: "" };
  }
  return { morning: parts[0], afternoon: parts[1] };
}

function getCellStyle(employee, day, employeeDayStatus) {
  const specific = employeeDayStatus[employee]?.[day];
  const type = specific || dayTypes[day] || "work";

  if (type === "holiday") {
    return {
      background: "#fecaca", // rouge clair
      color: "#7f1d1d",
    };
  }

  if (type === "vacation") {
    return {
      background: "#f9a8d4", // rose plus prononcé
      color: "#9d174d",
    };
  }

  if (type === "off") {
    return {
      background: "#e5e7eb", // gris plus visible
      color: "#4b5563",
    };
  }

  // travail
  return {
    background: "#bfdbfe", // bleu plus soutenu
    color: "#0b1120",
  };
}

function getDayType(employee, day, employeeDayStatus) {
  const specific = employeeDayStatus[employee]?.[day];
  return specific || dayTypes[day] || "work";
}

function getActualShift(actualShifts, employee, day) {
  const emp = actualShifts[employee];
  if (!emp) return "";
  return emp[day] || "";
}

function getWeeklyHours(employee) {
  return days.reduce((sum, day) => {
    const shift = getShift(initialShifts, employee, day);
    return sum + getShiftHours(shift);
  }, 0);
}

function Planning({ user, employees, onAddEmployee, onRemoveEmployee }) {
  const isManager = user.role === "manager";

  const [shifts, setShifts] = useState(initialShifts);
  const [employeeDayStatus, setEmployeeDayStatus] = useState(initialEmployeeDayStatus);
  const [actualShifts, setActualShifts] = useState({}); // { [employee]: { [day]: "08:00 - 12:00 / 18:00 - 22:00" } }
  const [weeklySubmissions, setWeeklySubmissions] = useState({}); // { [employee]: "employee_submitted" | "manager_validated" }
  const [selectedCell, setSelectedCell] = useState(null); // { employee, day }
  const [editorMorning, setEditorMorning] = useState("");
  const [editorAfternoon, setEditorAfternoon] = useState("");
  const [editorStatus, setEditorStatus] = useState("work");

  const visibleEmployees = isManager
    ? employees
    : employees.filter((emp) => emp === user.name);

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginTop: 0, fontSize: "1.6rem", color: "#0f172a" }}>Planning hebdomadaire</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        {isManager
          ? "Vue complète de tous les horaires de l'équipe."
          : `Bienvenue ${user.name}, bon courage pour ta semaine !`}
      </p>

      {isManager && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "12px",
            fontSize: "0.8rem",
            color: "#475569",
          }}
        >
          <span>Légende (clique sur une case pour changer) :</span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "16px",
                height: "10px",
                borderRadius: "4px",
                background: "#bfdbfe",
                border: "1px solid #60a5fa",
              }}
            ></span>
            <span>Travail</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "16px",
                height: "10px",
                borderRadius: "4px",
                background: "#e5e7eb",
                border: "1px solid #9ca3af",
              }}
            ></span>
            <span>Repos</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "16px",
                height: "10px",
                borderRadius: "4px",
                background: "#fecaca",
                border: "1px solid #fca5a5",
              }}
            ></span>
            <span>Jour férié</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "16px",
                height: "10px",
                borderRadius: "4px",
                background: "#f9a8d4",
                border: "1px solid #f472b6",
              }}
            ></span>
            <span>Vacances / congés</span>
          </div>
        </div>
      )}

      {isManager && (
        <div
          style={{
            marginBottom: "16px",
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            fontSize: "0.85rem",
          }}
        >
          <span style={{ fontWeight: 600 }}>Gestion des employés :</span>
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value && window.confirm(`Supprimer ${value} du planning ?`)) {
                onRemoveEmployee && onRemoveEmployee(value);
              }
              e.target.value = "";
            }}
            defaultValue=""
            style={{
              padding: "4px 8px",
              borderRadius: "999px",
              border: "1px solid #cbd5f5",
              fontSize: "0.8rem",
            }}
          >
            <option value="">Supprimer un employé...</option>
            {employees.map((emp) => (
              <option key={emp} value={emp}>
                {emp}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              const name = window.prompt("Nom du nouvel employé à ajouter :");
              if (!name) return;
              onAddEmployee && onAddEmployee(name);
            }}
            style={{
              borderRadius: "999px",
              border: "1px solid #0f4dcc",
              background: "white",
              color: "#0f4dcc",
              padding: "4px 10px",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            + Ajouter un employé
          </button>
        </div>
      )}

      {isManager && (
        <div
          style={{
            marginBottom: "16px",
            fontSize: "0.85rem",
            color: "#0f172a",
          }}
        >
          {employees.filter((e) => weeklySubmissions[e] === "employee_submitted").length > 0 ? (
            <>
              <div style={{ fontWeight: 600, marginBottom: "4px" }}>
                Semaines à valider :
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {employees
                  .filter((e) => weeklySubmissions[e] === "employee_submitted")
                  .map((e) => (
                    <div
                      key={e}
                      style={{
                        background: "white",
                        borderRadius: "999px",
                        border: "1px solid #cbd5f5",
                        padding: "4px 8px",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>{e}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setWeeklySubmissions((prev) => ({ ...prev, [e]: "manager_validated" }))
                        }
                        style={{
                          border: "none",
                          background: "#16a34a",
                          color: "white",
                          borderRadius: "999px",
                          padding: "2px 8px",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Valider
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setWeeklySubmissions((prev) => ({ ...prev, [e]: undefined }))
                        }
                        style={{
                          border: "none",
                          background: "transparent",
                          color: "#b91c1c",
                          fontSize: "0.75rem",
                          cursor: "pointer",
                        }}
                      >
                        Refuser
                      </button>
                    </div>
                  ))}
              </div>
            </>
          ) : (
            <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
              Aucune semaine en attente de validation.
            </div>
          )}
        </div>
      )}

      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            borderCollapse: "collapse",
            minWidth: "900px",
            background: "white",
            boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#0f172a", color: "white" }}>
            <tr>
              <th
                rowSpan={2}
                style={{ padding: "12px 16px", textAlign: "left", verticalAlign: "middle" }}
              >
                Employé
              </th>
              {days.map((day) => (
                <th
                  key={day}
                  colSpan={2}
                  style={{ padding: "8px 12px", textAlign: "center", fontSize: "0.9rem" }}
                >
                  {day}
                </th>
              ))}
            </tr>
            <tr>
              {days.map((day) => (
                <React.Fragment key={`${day}-sub`}>
                  <th style={{ padding: "4px 8px", textAlign: "center", fontSize: "0.8rem" }}>
                    Matin
                  </th>
                  <th style={{ padding: "4px 8px", textAlign: "center", fontSize: "0.8rem" }}>
                    Après-midi
                  </th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleEmployees.map((employee) => {
              const weeklyHours = getWeeklyHours(employee);
              const diff = weeklyHours - 43.5;
              const isOver = diff > 0.1;
              const isUnder = diff < -0.1;

              return (
                <tr key={employee}>
                  <td
                    style={{
                      padding: "10px 14px",
                      fontWeight: 600,
                      background: "#f1f5f9",
                      borderBottom: "1px solid #e2e8f0",
                    }}
                  >
                    <div>{employee}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "4px" }}>
                      {isManager
                        ? `${weeklyHours.toFixed(1)} h / 43.5 h${
                            isOver ? " (au-dessus)" : isUnder ? " (en-dessous)" : ""
                          }`
                        : "Contrat temps plein 43.5 h / semaine"}
                    </div>
                  </td>
                  {days.map((day) => {
                    const baseStyle = {
                      padding: "8px 10px",
                      textAlign: "center",
                      borderBottom: "1px solid #e2e8f0",
                      fontSize: "0.8rem",
                    };
                    const colorStyle = getCellStyle(employee, day, employeeDayStatus);
                    const dayType = getDayType(employee, day, employeeDayStatus);

                    const shift = getShift(shifts, employee, day);
                    const { morning, afternoon } = splitShift(shift);

                    const handleOpenEditor = () => {
                      const type = dayType;
                      const plannedShift = getShift(shifts, employee, day) || "";
                      const { morning: mPlanned, afternoon: aPlanned } = splitShift(plannedShift);

                      const actual = getActualShift(actualShifts, employee, day) || "";
                      const { morning: mActual, afternoon: aActual } = splitShift(actual);

                      setSelectedCell({ employee, day });
                      setEditorStatus(type);
                      if (isManager) {
                        setEditorMorning(type === "work" ? mPlanned : "");
                        setEditorAfternoon(type === "work" ? aPlanned : "");
                      } else {
                        setEditorMorning(mActual);
                        setEditorAfternoon(aActual);
                      }
                    };

                    let label = "";
                    if (dayType === "off") label = "Repos";
                    else if (dayType === "vacation") label = "Vacances";
                    else if (dayType === "holiday") label = "Férié";

                    let displayMorning;
                    let displayAfternoon;

                    if (dayType !== "work") {
                      // en repos / vacances / férié : jamais d'heures, seulement le libellé
                      displayMorning = label || "-";
                      displayAfternoon = label || "-";
                    } else {
                      displayMorning = morning || "-";
                      displayAfternoon = afternoon || "-";
                    }

                    return (
                      <React.Fragment key={day}>
                        <td
                          style={{
                            ...baseStyle,
                            ...colorStyle,
                            cursor: "pointer",
                            borderRight: "1px solid #e2e8f0",
                          }}
                          onClick={handleOpenEditor}
                        >
                          {displayMorning}
                        </td>
                        <td
                          style={{
                            ...baseStyle,
                            ...colorStyle,
                            cursor: "pointer",
                          }}
                          onClick={handleOpenEditor}
                        >
                          {displayAfternoon}
                        </td>
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {!isManager && (
        <div style={{ marginTop: "16px" }}>
          <button
            type="button"
            onClick={() =>
              setWeeklySubmissions((prev) => ({ ...prev, [user.name]: "employee_submitted" }))
            }
            style={{
              background: "#0f4dcc",
              color: "white",
              border: "none",
              borderRadius: "999px",
              padding: "8px 18px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Valider ma semaine
          </button>
          {weeklySubmissions[user.name] === "employee_submitted" && (
            <span
              style={{
                marginLeft: "10px",
                fontSize: "0.8rem",
                color: "#22c55e",
              }}
            >
              En attente de validation du manager
            </span>
          )}
          {weeklySubmissions[user.name] === "manager_validated" && (
            <span
              style={{
                marginLeft: "10px",
                fontSize: "0.8rem",
                color: "#16a34a",
              }}
            >
              Semaine validée par le manager
            </span>
          )}
        </div>
      )}
      {selectedCell && (
        <div
          style={{
            marginTop: "20px",
            maxWidth: "420px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 18px 35px rgba(15,23,42,0.18)",
            border: "1px solid #e2e8f0",
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div>
              <div style={{ fontSize: "0.8rem", color: "#64748b" }}>Édition du créneau</div>
              <div style={{ fontWeight: 600 }}>
                {selectedCell.employee} – {selectedCell.day}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedCell(null)}
              style={{
                border: "none",
                background: "transparent",
                color: "#64748b",
                cursor: "pointer",
                fontSize: "0.9rem",
              }}
            >
              Fermer
            </button>
          </div>

          {isManager ? (
            <>
              <div style={{ marginBottom: "10px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: 500, color: "#0f172a" }}>
                  Statut du jour
                  <select
                    value={editorStatus}
                    onChange={(e) => setEditorStatus(e.target.value)}
                    style={{
                      width: "100%",
                      marginTop: "4px",
                      padding: "6px 10px",
                      borderRadius: "999px",
                      border: "1px solid #cbd5f5",
                      fontSize: "0.85rem",
                    }}
                  >
                    <option value="work">Travail</option>
                    <option value="off">Repos</option>
                    <option value="holiday">Jour férié</option>
                    <option value="vacation">Vacances / congés</option>
                  </select>
                </label>
              </div>

              {editorStatus === "work" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "10px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    Matin
                    <input
                      type="text"
                      value={editorMorning}
                      onChange={(e) => setEditorMorning(e.target.value)}
                      placeholder="ex: 08:00 - 12:00"
                      style={{
                        width: "100%",
                        marginTop: "4px",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5f5",
                        fontSize: "0.85rem",
                      }}
                    />
                  </label>
                  <label style={{ fontSize: "0.85rem", fontWeight: 500 }}>
                    Après-midi
                    <input
                      type="text"
                      value={editorAfternoon}
                      onChange={(e) => setEditorAfternoon(e.target.value)}
                      placeholder="ex: 18:00 - 22:00"
                      style={{
                        width: "100%",
                        marginTop: "4px",
                        padding: "6px 10px",
                        borderRadius: "8px",
                        border: "1px solid #cbd5f5",
                        fontSize: "0.85rem",
                      }}
                    />
                  </label>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  const { employee, day } = selectedCell;

                  // mettre à jour le statut
                  setEmployeeDayStatus((prev) => {
                    const currentForEmp = prev[employee] || {};
                    return {
                      ...prev,
                      [employee]: {
                        ...currentForEmp,
                        [day]: editorStatus,
                      },
                    };
                  });

                  // mettre à jour les heures si travail, sinon vider
                  const combined =
                    editorStatus === "work"
                      ? [editorMorning.trim(), editorAfternoon.trim()].filter(Boolean).join(" / ")
                      : "";

                  setShifts((prev) => {
                    const updated = [...prev];
                    const idx = updated.findIndex(
                      (s) => s.employee === employee && s.day === day
                    );
                    if (idx >= 0) {
                      updated[idx] = { ...updated[idx], shift: combined || "-" };
                    } else {
                      updated.push({ employee, day, shift: combined || "-" });
                    }
                    return updated;
                  });

                  setSelectedCell(null);
                }}
                style={{
                  marginTop: "6px",
                  width: "100%",
                  background: "#0f4dcc",
                  color: "white",
                  border: "none",
                  borderRadius: "999px",
                  padding: "8px 0",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                }}
              >
                Enregistrer
              </button>
            </>
          ) : (
            (() => {
              const { employee, day } = selectedCell;
              const type = getDayType(employee, day, employeeDayStatus);
              const planned = getShift(shifts, employee, day);
              const { morning: plannedMorning, afternoon: plannedAfternoon } = splitShift(planned);
              const actual = getActualShift(actualShifts, employee, day);
              const { morning: actualMorning, afternoon: actualAfternoon } = splitShift(actual);

              let label = "Travail";
              if (type === "off") label = "Repos";
              else if (type === "vacation") label = "Vacances / congés";
              else if (type === "holiday") label = "Jour férié";

              return (
                <div style={{ fontSize: "0.9rem", color: "#0f172a" }}>
                  <p style={{ margin: "0 0 6px" }}>
                    <strong>Statut :</strong> {label}
                  </p>
                  {type === "work" && (
                    <>
                      <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#64748b" }}>
                        <strong>Heures prévues :</strong>
                      </p>
                      <p style={{ margin: "0 0 2px", fontSize: "0.85rem" }}>
                        Matin : {plannedMorning || "-"}
                      </p>
                      <p style={{ margin: "0 0 6px", fontSize: "0.85rem" }}>
                        Après-midi : {plannedAfternoon || "-"}
                      </p>

                      <p style={{ margin: "0 0 4px", fontSize: "0.85rem", color: "#64748b" }}>
                        <strong>Heures réelles (à saisir) :</strong>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditorMorning(plannedMorning || "");
                          setEditorAfternoon(plannedAfternoon || "");
                        }}
                        style={{
                          marginBottom: "6px",
                          borderRadius: "999px",
                          border: "1px solid #0f4dcc",
                          background: "white",
                          color: "#0f4dcc",
                          padding: "4px 10px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                        }}
                      >
                        Copier les heures prévues
                      </button>
                      <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "4px" }}>
                        Matin
                        <input
                          type="text"
                          value={editorMorning}
                          onChange={(e) => setEditorMorning(e.target.value)}
                          placeholder={plannedMorning || "08:00 - 12:00"}
                          style={{
                            width: "100%",
                            marginTop: "2px",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5f5",
                            fontSize: "0.8rem",
                          }}
                        />
                      </label>
                      <label style={{ fontSize: "0.8rem", display: "block", marginBottom: "6px" }}>
                        Après-midi
                        <input
                          type="text"
                          value={editorAfternoon}
                          onChange={(e) => setEditorAfternoon(e.target.value)}
                          placeholder={plannedAfternoon || "18:00 - 22:00"}
                          style={{
                            width: "100%",
                            marginTop: "2px",
                            padding: "4px 8px",
                            borderRadius: "8px",
                            border: "1px solid #cbd5f5",
                            fontSize: "0.8rem",
                          }}
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const combined = [editorMorning.trim(), editorAfternoon.trim()]
                            .filter(Boolean)
                            .join(" / ");
                          setActualShifts((prev) => {
                            const emp = prev[employee] || {};
                            return {
                              ...prev,
                              [employee]: {
                                ...emp,
                                [day]: combined || "",
                              },
                            };
                          });
                          setSelectedCell(null);
                        }}
                        style={{
                          marginTop: "4px",
                          width: "100%",
                          background: "#0f4dcc",
                          color: "white",
                          border: "none",
                          borderRadius: "999px",
                          padding: "6px 0",
                          cursor: "pointer",
                          fontWeight: 600,
                          fontSize: "0.85rem",
                        }}
                      >
                        Enregistrer mes heures
                      </button>
                    </>
                  )}
                  {type !== "work" && (
                    <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748b" }}>
                      Pas d'heures ce jour-là.
                    </p>
                  )}
                </div>
              );
            })()
          )}
        </div>
      )}
    </div>
  );
}

export default Planning;
