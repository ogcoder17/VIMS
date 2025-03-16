import { BrowserRouter, Routes, Route } from "react-router-dom";
import Patientdash from './Patientdash';
import Appointment from "./Appointment";
import Signup from './Signup';
import Login from './Login';
import Docdash from './Docdash'
import Staffdash from "./Staffdash";
import Prescription from "./Prescription";
import Signout from "./Signout";


function App() {


    return (
      <BrowserRouter>
        <Routes>
      
      <Route path="/Patientdash" element={<Patientdash />} ></Route>
      <Route path="/Appointment" element={<Appointment />}></Route>
      <Route path="/Signup" element={<Signup />}></Route>
      <Route path="/Login" element={<Login />}></Route>
      <Route path="/Docdash" element={<Docdash />}></Route>
      <Route path="/Staffdash" element={<Staffdash />}></Route>
      <Route path="/Prescription" element={<Prescription />}></Route>
      <Route path="/Signout" element={<Signout />}></Route>

        </Routes>
      </BrowserRouter>
    )
  }
  
  export default App
  