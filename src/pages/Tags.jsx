import React, { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Container } from "../components/Container";
import Footer from "../components/Footer";
import { databases } from "../utils/appwrite";
import { Query } from "appwrite";

function Tags() {
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getList = async () => {
    try {
      setLoading(true);
      const res = await databases.listDocuments(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_TAGS_COLLECTION_ID,
        [Query.orderAsc("tag"), Query.limit(100)]
      );
      console.log(res);
      setTagsList(res.documents);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getList();
  }, []);

  const groupTagsByAlphabet = (tags) => {
    const groupedTags = {};
    tags.forEach((tag) => {
      const firstLetter = tag.tag[0].toUpperCase();
      if (!groupedTags[firstLetter]) {
        groupedTags[firstLetter] = [];
      }
      groupedTags[firstLetter].push(tag);
    });
    return groupedTags;
  };

  return (
    <div>
      <Header />
      <Container>
        <h1 className="text-center my-10 text-3xl font-semibold underline decoration-wavy">
          Tags
        </h1>
        {loading ? (
          <p>Loading tags...</p>
        ) : (
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-10 ">
              {Object.keys(groupTagsByAlphabet(tagsList)).map((letter) => (
                <div key={letter} className="max-md:mt-10">
                  <h2 className="mb-2">{letter}</h2>
                  <div className="flex gap-2 flex-wrap  border p-5 border-gray-700 rounded-xl ">
                    {groupTagsByAlphabet(tagsList)[letter].map((tag) => (
                      <a
                        className="active:scale-[0.95] transition-all"
                        href={`/tag/${tag.$id}`}
                        key={tag.$id}
                      >
                        <div className="text-slate-600 dark:text-zinc-200 text-sm border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 px-1 py-1 pr-2 rounded-xl">
                          <span className="bg-slate-100 dark:bg-zinc-800 dark:text-zinc-500 inline-block p-0.5 px-1 mr-1 rounded-lg leading-none">
                            #
                          </span>
                          {tag.tag}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
      <Footer />
    </div>
  );
}

export default Tags;
