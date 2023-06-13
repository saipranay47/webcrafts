import React, { useState, useEffect } from "react";
import clsx from "clsx";
import axios from "axios";
import profilePlaceholder from "../images/profilePlaceholder.jpeg";
import { databases, storage } from "../utils/appwrite";
import { Query } from "appwrite";

function Search({innerclass, formw, ...props}) {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [users, setUsers] = useState([]);
  const [userData, setUserData] = useState([]);

  const [crafts, setCrafts] = useState([]);

  const [craftData, setCraftData] = useState([]);

  const [tags, setTags] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    console.log("searchString", searchString);
    if (searchString === "") {
      setUserData([]);
      setCrafts([]);
      setCraftData([]);
      setTags([]);
    } else {
      getUserData();
      getCrafts();
      loadImageUrl();
      getTags();
    }
    console.log("userData", userData);
  }, [searchString]);

  useEffect(() => {
    console.log("craftDataaaaaaaaaaaaaa", craftData);
  }, [craftData]);

  const handleInputFocus = () => {
    setIsPanelOpen(true);
  };

  const handleInputBlur = () => {
    setIsPanelOpen(false);
  };

  const getAllUsers = async () => {
    try {
      const response = await axios.get(`https://cloud.appwrite.io/v1/users/`, {
        headers: {
          "Content-Type": "application/json",
          "X-Appwrite-Response-Format": "1.0.0",
          "X-Appwrite-Project": "64731016883a2d49ac15",
          "X-Appwrite-Key":
            "57db0f34f2b14a4b380d1d252f8169e995c1f946727a34269107bdffa2b3423ac9543392cca93da16bfd6df2884ddc7aba438fb63cc96ec799a8959fac9caeb490c7363fffcd45ba6904ae18c2e4bca1ce429a2b84c860342832eb12c8f00bdcacc3fef7ba1e289dcaf87417f9f792b3d0b7c1f2a0be697781874100745045a9",
        },
      });

      console.log(response);
      const ress = response.data.users;
      setUsers(ress);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const getUserData = async () => {
    try {
      const filteredUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(searchString.toLowerCase());
      });

      const userDataArray = filteredUsers.slice(0, 3).map((user) => ({
        username: user.name,
        avatar: user.prefs.photo,
        userid: user.$id,
      }));

      setUserData(userDataArray);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const loadImageUrl = async (imgid) => {
    try {
      const result = await storage.getFilePreview(
        import.meta.env.VITE_PUBLIC_BUCKET_ID,
        imgid
      );
      const url = result.href;
      return Promise.resolve(url); // Resolve the URL as a string
    } catch (error) {
      console.log(error);
      return Promise.reject(error); // Reject the promise if an error occurs
    }
  };

  const getCrafts = async () => {
    databases
      .listDocuments(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_COLLECTION_ID,
        [
          Query.search("description", searchString),
          Query.orderDesc("$createdAt"),
        ]
      )
      .then((response) => {
        setCrafts(response.documents);
        console.log(response.documents);
      })
      .catch((error) => {
        console.error("Failed to fetch user crafts:", error);
      });
  };

  useEffect(() => {
    if (crafts.length > 0) {
      //   load image url
      const loadCraftImageUrls = async () => {
        const craftDataArray = await Promise.all(
          crafts.slice(0, 3).map(async (craft) => {
            if (craft.imgid) {
              return {
                image: await loadImageUrl(craft.imgid),
                craftid: craft.$id,
              };
            }
          })
        );
        setCraftData(craftDataArray);
      };

      loadCraftImageUrls();
    }
  }, [crafts]);

  const getTags = async () => {
    try {
      const res = await databases.listDocuments(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_TAGS_COLLECTION_ID,
        [
          Query.search("tag", searchString),
          Query.orderAsc("tag"),
          Query.limit(8),
        ]
      );
      console.log(res);
      setTags(res.documents);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" flex justify-center flex-1" {...props}>
      <div
        className="opacity-100 transition-all relative z-20 mt-[4px]"
        style={{ width: formw }}
      >
        <form method="get" action="/search">
          <div className="relative flex items-center group px-3 w-full">
            <div className="flex absolute w-5 mx-3 pointer-events-none text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                className="w-5 text-zinc-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </div>
            <input
              id="keyword"
              name="keyword"
              autoComplete="off"
              placeholder="Search..."
              className="bg-zinc-900/50 py-1.5 pl-10 outline-none rounded-full text-zinc-500 placeholder:text-zinc-500 focus:text-slate-200 border border-slate-900/10 transition-all w-full md:w-96 max-w-full shadow-[inset_0_0_2px_rgba(255,255,255,0.4)] m-auto"
              value={searchString}
              onFocus={handleInputFocus}
              onChange={(e) => setSearchString(e.target.value)}
            />

            <div className="absolute top-0 right-0 pt-2 pr-3 text-slate-400 overflow-hidden" />
          </div>
        </form>
        {isPanelOpen && (
          <div
            className={clsx("transform transition-opacity duration-1000", {
              "opacity-0 translate-y-10": !isPanelOpen,
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={innerclass}>
              <div className="flex flex-col select-none divide-y divide-slate-200 dark:divide-zinc-800">
                {userData.length != 0 && (
                  <div className="flex flex-col p-6 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 dark:text-zinc-200 font-medium text-base leading-none">
                        Users
                      </span>
                    </div>
                    <div className="relative flex flex-col mt-2 -mb-1">
                      {userData.map((user) => (
                        <a
                          className="group flex justify-between text-sm rounded-full text-slate-600 hover:text-gray-800 active:scale-[0.98] transition-all"
                          href={`/users/${user.userid}`}
                          key={user.userid}
                        >
                          <div className="flex items-center gap-2 py-1">
                            <div
                              className="shrink-0 rounded-full overflow-hidden"
                              style={{ width: 24, height: 24 }}
                            >
                              <picture>
                                {user.avatar == null ? (
                                  <div className="flex items-center justify-center w-[24px] h-[24px] bg-gray-200 rounded-full">
                                    <span className="text-gray-500 mb-[3px]">
                                      {user.username.charAt(0)}
                                    </span>
                                  </div>
                                ) : (
                                  <img
                                    alt={`Avatar of ${user.username}`}
                                    src={user.avatar}
                                    loading="eager"
                                    decoding="sync"
                                    className="rounded-full block object-cover"
                                    style={{ width: 24, height: 24 }}
                                  />
                                )}
                              </picture>
                            </div>
                            <span className="capitalize dark:text-zinc-200">
                              {user.username}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-zinc-600">
                              {user.handle}
                            </span>
                          </div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            className="w-3 text-slate-600 dark:text-zinc-600 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                            />
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                {crafts.length != 0 && (
                  <div className="flex flex-col p-6 gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-900 dark:text-zinc-200 font-medium text-base leading-none">
                        Crafts
                      </span>
                      <a
                        className="group flex gap-1 text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-slate-200"
                        href={`/search?keyword=${searchString}`}
                      >
                        View all{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          className="w-3 text-slate-600 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-zinc-200"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </a>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {craftData.map((craft, index) => (
                        <a
                          className="hover:opacity-80 active:scale-[0.95] transition-all"
                          href={`/craft/${craft.craftid}`}
                          key={index}
                        >
                          <div className="relative w-full h-full group">
                            <div className="absolute z-30 inset-0 shadow-[inset_0_0_1px_1px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_1px_1px_rgba(255,255,255,0.1)] pointer-events-none rounded-lg" />
                            <picture className="absolute z-10 w-full h-full flex items-center justify-center">
                              <img
                                alt="Personal Website Design"
                                src={craft.image}
                                width={4800}
                                height={3600}
                                loading="eager"
                                decoding="sync"
                                className="relative block select-none transition-all duration-300 rounded-lg w-full h-full object-cover opacity-100 scale-100"
                              />
                            </picture>
                            <div
                              className="w-full h-full flex items-center justify-center text-slate-300"
                              style={{ aspectRatio: "1.33 / 1" }}
                            />
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {tags.length != 0 && (
                  <div className="flex flex-col p-6 gap-2">
                    <div className="flex items-center justify-between">
                      <a href="/tags">
                        <span className="text-slate-900 dark:text-zinc-200 font-medium text-base leading-none">
                          Tags
                        </span>
                      </a>
                      <a
                        className="group flex gap-1 text-sm text-slate-500 dark:text-zinc-500 hover:text-slate-900 dark:hover:text-slate-200"
                        href="/tags"
                      >
                        View all{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          className="w-3 text-slate-600 dark:text-zinc-500 group-hover:text-slate-900 dark:group-hover:text-zinc-200"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </a>
                    </div>
                    <div className="flex gap-2 flex-wrap pt-2">
                      {tags.map((tag) => (
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      {isPanelOpen && (
        <div
          className="block fixed inset-0 h-screen z-10 origin-top bg-black transform opacity-70"
          onClick={handleInputBlur}
        ></div>
      )}
    </div>
  );
}

export default Search;
