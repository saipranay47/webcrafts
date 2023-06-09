import React, { useState, useEffect } from "react";
import { databases } from "../utils/appwrite";
import { Query } from "appwrite";
import Card from "../components/Card";


export default function UserCrafts({ userid }) {
  const [userCrafts, setuserCrafts] = useState([]);


  useEffect(() => {
    if (userid) {
      databases
        .listDocuments(
          import.meta.env.VITE_PUBLIC_DATABASE_ID,
          import.meta.env.VITE_PUBLIC_COLLECTION_ID,
          [Query.equal("uid", userid), Query.orderDesc("$createdAt")]
        )
        .then((response) => {
          setuserCrafts(response.documents);
          console.log(response.documents);
        })
        .catch((error) => {
          console.error("Failed to fetch user crafts:", error);
        });
    }
  }, [userid]);

  return (
    <div className="flex w-full gap-5 justify-center items-center flex-wrap px-10">
      {userCrafts.map((craft) => (
        <Card
          key={craft.$id}
          craftid={craft.$id}
          title={craft.title}
          tags={craft.tags}
          description={craft.description}
          username={craft.username}
          image={craft.imgid} // Pass the image ID to the Card component
          liveLink={craft.liveLink}
          sourceCode={craft.sourceCodeLink}
          userid={craft.uid}
          likes={craft.likes}
          likeCount={craft.likeCount}
        />
      ))}
    </div>
  );
}
