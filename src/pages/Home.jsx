import React from "react";
import { useUser } from "../hooks/user";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Container } from "../components/Container";
import Card from "../components/Card";
import ListAllCrafts from "../components/ListAllCrafts";
import Footer from "../components/Footer";
import Search from "../components/Search";

function Home() {
  // Inside your component
  const { user } = useUser();
  const navigate = useNavigate();
  const { logout } = useUser();


  const handleLogout = async () => {
    await logout();
    alert("logout");
    navigate("/login");
  };

  return (
    <div className="min-h-screen">
      <Header />
      <Container className="bg-[#10101D] text-white max-w-full mb-24">

        <br />
        <br />
        <br />
        <ListAllCrafts />
      </Container>
      {/* <Search/> */}
      <Footer/>
    </div>
  );
}

export default Home;
