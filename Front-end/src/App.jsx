import { useState, useEffect} from "react";
import {useNavigate,
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import {Navbar} from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import NoFound from "./components/notFound";

axios.defaults.withCredentials = true;
const API_URL = '/api/auth';

function App() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        // Intenta obtener los datos del usuario del endpoint /me
        const response = await axios.get(`${API_URL}/me`);
        setUser(response.data); // Si tiene éxito, establece el usuario
      } catch (err) {
        console.log('No user session found.');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);
  
if(loading){
  return <div className="">Loading...</div>
}
  return (
      <Router>
          <Navbar user={user} setUser={setUser}/>
        <Routes>
          <Route path="/" element={<Home user={user} error={error}/>} />
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login setUser={setUser} />} />
          <Route path="/register" element={user ? <Navigate to="/" /> : <Register setUser={setUser} />} />
          <Route path="*" element={<NoFound />}/>
        </Routes>
      </Router>
  );
}

export default App;
