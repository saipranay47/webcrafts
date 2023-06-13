import React, { useState, useEffect } from "react";
import { useUser } from "../hooks/user";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import ProfileTop from "../components/ProfileTop";
import UserCrafts from "../abc/UserCrafts";
import axios from "axios";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

function UserPage() {
  const { user } = useUser();
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `https://cloud.appwrite.io/v1/users/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "X-Appwrite-Response-Format": "1.0.0",
              "X-Appwrite-Project": "64731016883a2d49ac15",
              "X-Appwrite-Key":
                "57db0f34f2b14a4b380d1d252f8169e995c1f946727a34269107bdffa2b3423ac9543392cca93da16bfd6df2884ddc7aba438fb63cc96ec799a8959fac9caeb490c7363fffcd45ba6904ae18c2e4bca1ce429a2b84c860342832eb12c8f00bdcacc3fef7ba1e289dcaf87417f9f792b3d0b7c1f2a0be697781874100745045a9",
            },
          }
        );

        console.log(response);
        const userData = response.data;
        console.log(userData);
        setData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [id]);

  console.log(data); // Log the fetched user data here

  return (
    <div>
      <Header />
      <div className="bg-[#10101D] text-white w-full h-full min-h-screen">
        {data ? (
          <div>
            <ProfileTop auth={data} />
            {/* Render userCrafts here */}
            <hr className=" mt-10 mb-20" />
            <UserCrafts userid={id} />
          </div>
        ) : (
          <div className="w-full h-full min-h-screen flex justify-center items-center">
            Fetching user data...
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default UserPage;
