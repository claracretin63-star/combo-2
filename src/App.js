import { BrowserRouter, Routes, Route } from "react-router-dom"

import Navbar from "./Navbar"
import Planning from "./Planning"
import Team from "./Team"
import Payroll from "./Payroll"
function App(){

return(

<BrowserRouter>

<Navbar/>

<Routes>

<Route path="/" element={<Planning/>} />
<Route path="/team" element={<Team/>} />
<Route path="/payroll" element={<Payroll/>} />

</Routes>

</BrowserRouter>

)

}

export default App