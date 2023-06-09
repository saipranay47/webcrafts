import React from "react";
import { useUser } from "../hooks/user";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { Container } from "../components/Container";
import Card from "../components/Card";
import ListAllCrafts from "../components/ListAllCrafts";
import Footer from "../components/Footer";

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
      <Container className="bg-[#10101D] text-white max-w-full">
        {/* {user ? (
          <h1>Hello {user.name} 👋</h1>
        ) : (
          <div>
            <ul>
              <li>
                <Link to="/sign-up">Register</Link>
              </li>
              <li>
                <Link to="/sign-in">Login</Link>
              </li>
            </ul>
          </div>
        )} */}

        {/* <button onClick={handleLogout}>Log out</button> */}
        {/* <div className="flex gap-5 justify-center items-center flex-wrap">
          <Card
            title="developer portfolio"
            tags={hashtags}
            description="Hi, I am Sai Pranay a design-minded front-end developer who loves
              to create beautiful interfaces and experiences"
            image="https://1.bp.blogspot.com/__3OWaeX1H-s/TNwj4ppfyFI/AAAAAAAAErI/mQLf8eBoJ0o/s1600/random1.jpg"
            username={user.name}
          />
        </div> */}
        <br />
        <br />
        <br />
        <ListAllCrafts />
      </Container>
      <Footer/>
    </div>
  );
}

export default Home;
