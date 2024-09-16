import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from "./ProtectedRoute";
import { ToastContainer } from 'react-toastify';
import Navbar from './Pages/Navbar'; // Adjust the path as needed

import Home from './Pages/Home';
import Signup from './Pages/LogSIgn/Signup';
import Login from './Pages/LogSIgn/Login';
import ReceivedRequests from './Pages/Requests/ReceivedRequests';

import './App.css';
import Sent from './Pages/Requests/Sent';

function App() {
  return (
    <Router>
      <ToastContainer />
      <div className="flex">
        <Navbar /> {/* Include the Navbar component */}
        <div className="flex-1 ">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signUp" element={<Signup />} />
            <Route path="/" element={<ProtectedRoute element={<Home />} />} />
            <Route path="/requests" element={<ProtectedRoute element={<ReceivedRequests />} />} />
            <Route path = "/sent" element={<ProtectedRoute element={<Sent />} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
