import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import { databases } from "../utils/appwrite";
import { Query } from "appwrite";
import Card from "../components/Card";
import { Container } from "../components/Container";

function TagsSearch() {
  const { keyword } = useParams();
  const [loading, setLoading] = useState(true);

  const [crafts, setCrafts] = useState([]);


  useEffect(() => {
    if (keyword) {
      setLoading(true);

      databases
        .listDocuments(
          import.meta.env.VITE_PUBLIC_DATABASE_ID,
          import.meta.env.VITE_PUBLIC_COLLECTION_ID,
          [Query.search("tags", keyword), Query.orderDesc("$createdAt")]
        )
        .then((response) => {
          setCrafts(response.documents);
          console.log(response.documents);
        })
        .catch((error) => {
          console.error("Failed to fetch user crafts:", error);
        });
      setLoading(false);
    }
  }, [keyword]);

  return (
    <div>
      <Header />
      <div className="w-full flex justify-center items-center my-10">
        <h1>Search Results for tag "{keyword}"</h1>
      </div>
      <Container className="bg-[#10101D] text-white max-w-full min-h-screen">
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
      </Container>
      <Footer />
    </div>
  );
}

export default TagsSearch;
