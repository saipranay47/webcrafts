import React, { useState, useEffect } from "react";
import banner from "../images/banner.png";
import avatar from "../images/avatar.svg";
import mark from "../images/mark.png";
import { Container } from "./Container";

import { databases } from "../utils/appwrite";
import { Query } from "appwrite";

function ProfileEditable({ auth }) {
  console.log(auth);
  const [Crafts, setuserCrafts] = useState([]);
  const [totalLikes, setTotalLikes] = useState(0);
  useEffect(() => {
    if (auth) {
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
      <img src={banner} alt="" className="w-full max-h-72" />
      <Container className=" text-white flex flex-col  h-full">
        <div className="flex absolute -translate-y-1/2">
          <img
            src={avatar}
            alt=""
            className="w-[180px] h-[180px] rounded-full"
          />

          <span className="relative flex justify-center items-center gap-2 translate-y-full p-5 pt-6 h-min">
            <img src={mark} alt="" className="h-[48px] w-auto" />
            <p className=" text-5xl">{totalLikes}</p>
          </span>
        </div>
        <div className="h-[100px]"></div>
        <div className="flex flex-col gap-2 mt-5">
          <h1 className="text-5xl font-bold">{auth.name}</h1>
          <p className="text-2xl">{auth.email}</p>
        </div>
      </Container>
    </div>
  );
}

export default ProfileEditable;
