import React, { useState, useEffect } from "react";
import banner from "../images/banner.png";
import avatar from "../images/avatar.svg";
import mark from "../images/mark.png";
import { Container } from "./Container";
import GitHubCalendar from "react-github-calendar";
import github from "../images/github.svg";
import hashnode from "../images/hashnode.png";
import Widgets from "../abc/Widgets";
import { databases } from "../utils/appwrite";
import { Query } from "appwrite";

function ProfileTop({ auth }) {
  console.log(auth);
  const [Crafts, setuserCrafts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  
  useEffect(() => {
    if (auth) {
      console.log(auth);
      databases
        .listDocuments(
          import.meta.env.VITE_PUBLIC_DATABASE_ID,
          import.meta.env.VITE_PUBLIC_COLLECTION_ID,
          [Query.equal("uid", auth.$id), Query.orderDesc("$createdAt")]
        )
        .then((response) => {
          setuserCrafts(response.documents);
          console.log(response.documents);
          console.log(Crafts);
          let likesCount = 0;
          response.documents.forEach((craft) => {
            likesCount += craft.likeCount;
          });
          setTotalLikes(likesCount);
        })
        .catch((error) => {
          console.error("Failed to fetch user crafts:", error);
        });
    }
  }, [auth]);


  return (
    <div>
      {auth.prefs ? (
        auth.prefs.coverPhoto ? (
          <img
            src={auth.prefs.coverPhoto}
            alt=""
            className="w-full max-h-72 object-cover"
          />
        ) : (
          <img src={banner} alt="" className="w-full max-h-72 object-cover" />
        )
      ) : (
        <img src={banner} alt="" className="w-full max-h-72 object-cover" />
      )}
      <Container className=" text-white flex  h-full justify-between items-center max-xl:flex-wrap max-w-[1400px]">
        <div className="max-w-min">
          <div className="flex absolute -translate-y-1/2 ">
            {auth.prefs ? (
              auth.prefs.photo ? (
                <img
                  src={auth.prefs.photo}
                  alt=""
                  className="w-[180px] h-[180px] rounded-full bg-white object-cover"
                />
              ) : (
                <span className=" bg-gray-100 rounded-full">
                  <svg
                    className=" text-gray-300 w-[180px] h-[180px] rounded-full object-cover"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
              )
            ) : (
              <span className=" bg-gray-100 rounded-full">
                <svg
                  className=" text-gray-300 w-[180px] h-[180px] rounded-full object-cover"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </span>
            )}

            <span className="relative flex justify-center items-center gap-2 translate-y-full p-5 pt-6 h-min">
              <img src={mark} alt="" className="h-[48px] w-auto" />
              <p className=" text-5xl">{totalLikes}</p>
            </span>
          </div>
          <div className="h-[100px]"></div>
          <div className="flex flex-col gap-2 mt-5 min-w-[250px]">
            <h1 className="text-5xl font-bold">{auth.name}</h1>
            <p className="text-2xl">{auth.email}</p>
          </div>
        </div>
        <Widgets auth={auth}/>
      </Container>
    </div>
  );
}

export default ProfileTop;
