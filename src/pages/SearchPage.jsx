import React from "react";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import banner from "../images/banner.png";
import Search from "../components/Search";

function SearchPage() {
  return (
    <div>
      <Header />
      <div className="w-full min-h-screen">
        <img src={banner} alt="" className=" h-40 w-full" />
        <Search className="flex justify-center flex-1 relative -top-24" formw="100%" innerclass="mt-20" />
      </div>
      <Footer />
    </div>
  );
}

export default SearchPage;
