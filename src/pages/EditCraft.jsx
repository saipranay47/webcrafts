import React, { useState, useEffect } from "react";
import { useUser } from "../hooks/user";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Container } from "../components/Container";
import CraftForm from "../components/CraftForm";
import { databases } from "../utils/appwrite";

function EditCraft() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { id } = useParams();
  const [craft, setCraft] = useState(null);

  const getCraft = async () => {
    try {
      const res = await databases.getDocument(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_COLLECTION_ID,
        id
      );
      setCraft(res);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCraft();

  }, [user]);



  return (
    <div>
      <Container className="bg-[#10101D] text-white w-full h-full min-h-screen">
        {user && user.$id == craft?.uid ? (
          <CraftForm auth={user} craft={craft} />
        ) : (
          <div className="w-full h-full min-h-screen flex justify-center items-center">
            <span>
              You are not authorised to edit this craft{" "}
              <Link to="/" className="underline font-semibold text-sky-500">
                go back to Home page
              </Link>{" "}
            </span>
          </div>
        )}
      </Container>
    </div>
  );
}

export default EditCraft;
