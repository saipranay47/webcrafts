import React, { useState, useEffect } from "react";
import { databases } from "../utils/appwrite";
import Card from "./Card";
import { Query } from "appwrite";

function ListAllCrafts() {
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  const getList = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_COLLECTION_ID,
        [Query.orderDesc("$createdAt")]
      );
      console.log(res);
      setCrafts(res.documents);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  return (
    <div className="flex gap-5 justify-center items-center flex-wrap">
      {loading ? (
        <h1>Loading...</h1>
      ) : (
        crafts.map((craft) => (
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
        ))
      )}
    </div>
  );
}

export default ListAllCrafts;
