import React from "react";
import { Header } from "../components/Header";
import { Container } from "../components/Container";
import Footer from "../components/Footer";

function CraftedDevs() {
  return (
    <div>
      <Header/>
      <Container className="min-h-screen">Crafted devs</Container>
      <Footer />
    </div>
  );
}

export default CraftedDevs;
