import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import axios from "axios";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { databases, storage } from "../utils/appwrite";
import { Query } from "appwrite";
import { useUser } from "../hooks/user";
import CardModel from "../components/CardModel";
import profilePlaceholder from "../images/profilePlaceholder.jpeg";

function Craft() {
  const [craft, setCraft] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [profilepic, setProfilepic] = useState(null);

  const getimages = async (res) => {
    // Fetch user data
    console.log(res);

    axios
      .get(`https://cloud.appwrite.io/v1/users/${res.uid}/prefs`, {
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Response-Format": "1.0.0",
          "X-Appwrite-Project": "64731016883a2d49ac15",
          "X-Appwrite-Key":
            "57db0f34f2b14a4b380d1d252f8169e995c1f946727a34269107bdffa2b3423ac9543392cca93da16bfd6df2884ddc7aba438fb63cc96ec799a8959fac9caeb490c7363fffcd45ba6904ae18c2e4bca1ce429a2b84c860342832eb12c8f00bdcacc3fef7ba1e289dcaf87417f9f792b3d0b7c1f2a0be697781874100745045a9",
        },
      })
      .then((response) => {
        const { photo } = response.data;

        if (photo) {
          setProfilepic(photo);
        } else {
          setProfilepic(profilePlaceholder);
        }
      })
      .catch((error) => {
        console.error("Failed to retrieve user preferences:", error);
        // Handle error notifications or show error messages
      });

    // Fetch image URL
    const result = await storage.getFilePreview(
      import.meta.env.VITE_PUBLIC_BUCKET_ID,
      res.imgid
    );
    setImageUrl(result.href);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch craft details
        databases
          .getDocument(
            import.meta.env.VITE_PUBLIC_DATABASE_ID,
            import.meta.env.VITE_PUBLIC_COLLECTION_ID,
            id
          )
          .then((res) => {
            console.log(res);
            setCraft(res);
            getimages(res);
          });

        setLoading(false);
      } catch (error) {
        console.log("Error fetching craft data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div>
      <Header />

      {loading ? (
        <div className="min-h-screen flex justify-center items-center">
          Loading...
        </div>
      ) : craft === null ? (
        <div className="min-h-screen flex justify-center items-center">
          Not found
        </div>
      ) : (
        <CardModel
          title={craft?.title}
          description={craft?.description}
          imageurl={imageUrl}
          username={craft?.username}
          tags={craft?.tags}
          liveLink={craft?.liveLink}
          sourceCode={craft?.sourceCode}
          userid={craft?.uid}
          craftid={id}
          likes={craft?.likes}
          likeCount={craft?.likeCount}
          profilePic={profilepic}
        />
      )}

      <Footer />
    </div>
  );
}

export default Craft;
