import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{display:"flex", gap:"20px", background:"#1e293b", padding:"15px"}}>

      <Link to="/">Planning</Link>
      <Link to="/team">Equipe</Link>
      <Link to="/payroll">Salaires</Link>

    </div>
  );
}

export default Navbar;
