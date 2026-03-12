const team = [
  { name: "Allan", role: "Employé polyvalent", contract: "Temps plein (43.5 h)", color: "#3b82f6" },
  { name: "Lea", role: "Employé polyvalent", contract: "Temps plein (43.5 h)", color: "#eab308" },
  { name: "Clara", role: "Directrice / responsable salle", contract: "Temps plein (43.5 h)", color: "#22c55e" },
  { name: "Karim", role: "Chef de partie cuisine", contract: "Temps plein (43.5 h)", color: "#f97316" },
  { name: "Tony", role: "Chef de cuisine", contract: "Temps plein (43.5 h)", color: "#a855f7" },
];

const coworkersByEmployee = {
  Allan: ["Lea", "Clara", "Karim"],
  Lea: ["Allan", "Karim", "Tony"],
  Clara: ["Allan", "Tony"],
  Tony: ["Lea", "Karim"],
  Karim: ["Allan", "Lea", "Tony"],
};

function Team({ user }) {
  const isManager = user.role === "manager";

  // les employés peuvent voir uniquement leur propre fiche
  const visibleTeam = isManager ? team : team.filter((m) => m.name === user.name);

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ marginTop: 0, fontSize: "1.6rem", color: "#0f172a" }}>Équipe</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        {isManager
          ? "Vue synthétique de ton équipe (rôle, type de contrat), comme dans Combo."
          : "Tu vois ton profil et avec qui tu es souvent en équipe sur la même période."}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {visibleTeam.map((member) => (
          <div
            key={member.name}
            style={{
              background: "white",
              borderRadius: "12px",
              padding: "18px",
              boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
              border: "1px solid #e2e8f0",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "999px",
                background: member.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontWeight: 700,
                marginBottom: "10px",
              }}
            >
              {member.name[0]}
            </div>
            <h3 style={{ margin: 0, marginBottom: "4px" }}>{member.name}</h3>
            <p style={{ margin: 0, color: "#334155", fontSize: "0.9rem" }}>{member.role}</p>
            <p style={{ marginTop: "8px", fontSize: "0.85rem", color: "#64748b" }}>
              Contrat : {member.contract}
            </p>

            {!isManager && coworkersByEmployee[member.name] && (
              <div
                style={{
                  marginTop: "10px",
                  paddingTop: "8px",
                  borderTop: "1px solid #e2e8f0",
                  fontSize: "0.8rem",
                  color: "#64748b",
                }}
              >
                Travaille souvent avec :{" "}
                <span style={{ fontWeight: 500, color: "#0f172a" }}>
                  {coworkersByEmployee[member.name].join(", ")}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;
