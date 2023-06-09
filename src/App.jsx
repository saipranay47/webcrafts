import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route, Link } from "react-router-dom";
import { UserProvider } from "./hooks/user";
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import New from './pages/New';
import Profile from './pages/Profile';
import EditProfile from "./components/EditProfile";
import UserPage from "./pages/UserPage";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="main font-inter bg-[#10101D] text-white min-h-screen">
      <UserProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new" element={<New />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profileupdate" element={<EditProfile />} />
          <Route path="/users/:id" element={<UserPage />} />
        </Routes>
        {/* </Container> */}
      </UserProvider>
    </div>
  );
}

export default App
