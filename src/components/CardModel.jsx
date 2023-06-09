import React, { useEffect, useState } from "react";
import { Container } from "./Container";
import { Button, ButtonUrl } from "./Button";
import avatar from "../images/avatar.svg";
import mark from "../images/mark.png";
import markwhite from "../images/markwhite.svg";
import buttonbg from "../images/buttonbg.png";
import share from "../images/share.svg";
import save from "../images/save.svg";
import comment from "../images/comment.svg";
import { useUser } from "../hooks/user";
import UserCrafts from "../abc/UserCrafts";
import { client, databases } from "../utils/appwrite";
import { Link } from "react-router-dom";

function CardModel({
  title,
  description,
  tags,
  username,
  imageurl,
  liveLink,
  sourceCode,
  userid,
  craftid,
  likes,
  likeCount,
  profilePic,
  ...props
}) {
  const [liked, setLiked] = useState(false);
  const { user } = useUser();
  const [data, setData] = useState({
    craftid,
    title,
    description,
    tags,
    username,
    imageurl,
    liveLink,
    sourceCode,
    userid,
    likes,
    likeCount,
  });
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    // Check if the logged-in user has already liked the craft
    if (user && likes.includes(user.$id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, []);

  const handleLike = (id, action) => {
    setLikeLoading(true);
    databases
      .getDocument(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_COLLECTION_ID,
        id
      )
      .then((res) => {
        databases
          .updateDocument(
            import.meta.env.VITE_PUBLIC_DATABASE_ID,
            import.meta.env.VITE_PUBLIC_COLLECTION_ID,
            id,
            {
              likes:
                action === "dec"
                  ? res.likes.filter((item) => item !== user.$id)
                  : [...(res.likes || []), user.$id],
              likeCount:
                action === "dec" ? res.likeCount - 1 : (res.likeCount || 0) + 1,
            }
          )
          .then((res) => {
            setData((prev) => ({
              ...prev,
              likes: res.likes,
              likeCount: res.likeCount,
            }));
          });
        setLiked(action === "dec" ? false : true);
        setLikeLoading(false);
      })

      .catch((err) => console.log(err));
  };

  const handleLikeClick = () => {
    if (user) {
      handleLike(craftid, liked ? "dec" : "inc");
    } else {
      console.log("Please login to like");
    }
  };

  return (
    <div className="relative">
      <div className="sm:absolute top-10 right-[40px] pt-[40px] lg:w-[40px] md:h-full  h-[40px] hidden sm:block">
        <div className="sticky top-20 flex md:flex-col gap-4 h-[40px] ">
          <Link to={`/users/${userid}`}>
            <img
              src={profilePic}
              alt=""
              className="h-[40px] w-[40px] rounded-full"
            />
          </Link>

          <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
            <img src={share} className="opacity-60 h-full" />
          </div>
          <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
            <img src={save} className="opacity-60 h-full" />
          </div>
          <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
            <img src={comment} className="opacity-60 h-full" />
          </div>
        </div>
      </div>
      <Container className="md:px-[68px] md:py-[120px] md:pb-[0px] p-5 pt-10 mb-10">
        <div className="mx-auto max-w-7xl">
          <div className="felx md:mx-[44px]">
            <div className="w-full px-6 md:px-20 m-auto flex flex-col md:flex-row justify-between items-end min-md:items-start ">
              <h2 className="text-2xl md:text-4xl font-semibold mb-3">
                {username}
              </h2>

              <div className="right-[40px] lg:w-[40px] md:h-full  h-[40px] hidden max-sm:block">
                <div className="sticky top-20 flex md:flex-col gap-4 h-[40px] ">
                  <img
                    src={profilePic}
                    alt=""
                    className="h-[40px] w-[40px] rounded-full"
                  />

                  <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                    <img src={share} className="opacity-60 h-full" />
                  </div>
                  <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                    <img src={save} className="opacity-60 h-full" />
                  </div>
                  <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                    <img src={comment} className="opacity-60 h-full" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 w-max mt-5 sm:mt-0 flex-wrap items-end">
                <button
                  className="group inline-flex items-center justify-center rounded-full py-2 px-4 text-sm font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 gap-1 bg-gray-200 cursor-pointer"
                  style={{
                    backgroundImage: liked ? `url(${buttonbg})` : "none",
                    backgroundSize: "cover",
                    color: liked ? "white" : "black",
                    cursor: !user ? "not-allowed" : "pointer",
                  }}
                  onClick={handleLikeClick}
                  disabled={!user}
                  title={!user ? "Please log in to like" : ""}
                >
                  {likeLoading ? (
                    // spinner
                    <svg
                      className="animate-spin h-5 w-5 "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    <span className="flex items-center gap-1">
                      <img
                        src={liked ? markwhite : mark}
                        alt=""
                        className="brightness-100 h-3"
                      />
                      <p>{data.likeCount}</p>
                    </span>
                  )}
                </button>

                <ButtonUrl color="white" href={liveLink}>
                  Live site
                </ButtonUrl>
                <ButtonUrl color="white" href={sourceCode}>
                  Source code
                </ButtonUrl>
              </div>
            </div>
            <div className="py-6 md:py-10">
              <img src={imageurl} alt="" className="w-full rounded-2xl" />
            </div>
            <div className="w-full px-4 md:px-20 m-auto ">
              <h2 className="text-xl md:text-3xl font-semibold underline">
                {title}
              </h2>
              <br />
              <p className="text-base md:text-xl">{description}</p>
              <br />
              <div className="flex gap-2 pb-3 md:pb-6">
                {tags.map((tag) => (
                  <span className="text-white bg-zinc-900 px-3 py-1 rounded-full border border-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <br />
        <br />
        <br />
        <hr />
        <h3 className="mt-8 ml-8">More by {username}</h3>
      </Container>
      <UserCrafts userid={userid} />
    </div>
  );
}

export default CardModel;
