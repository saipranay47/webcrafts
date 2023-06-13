import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";
import { UserProvider } from "./hooks/user";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import New from "./pages/New";
import Profile from "./pages/Profile";
import EditProfile from "./components/EditProfile";
import UserPage from "./pages/UserPage";
import Craft from "./pages/Craft";
import SearchResults from "./pages/SearchResults";
import Tags from "./pages/Tags";
import TagsSearch from "./pages/TagsSearch";
import EditCraft from "./pages/EditCraft";
import CraftedDevs from "./pages/CraftedDevs";
import Landing from "./pages/Landing";
import SearchPage from "./pages/SearchPage";

function App() {
  return (
    <div className="main font-inter bg-[#10101D] text-white min-h-screen">
      <UserProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="craftsshowcase" element={<Home />} />
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="new" element={<New />} />
          <Route path="editcraft/:id" element={<EditCraft />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profileupdate" element={<EditProfile />} />
          <Route path="users/:id" element={<UserPage />} />
          <Route path="craft/:id" element={<Craft />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="searchpage" element={<SearchPage />} />
          <Route path="tags" element={<Tags />} />
          <Route path="tag/:keyword" element={<TagsSearch />} />
          <Route path="*" element={<Landing />} />
        </Routes>
        {/* </Container> */}
      </UserProvider>
    </div>
  );
}

export default App;
