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
import ShareComponent from "./ShareComponent";
import CommentComponent from "./CommentComponent";
import Share from "./Share";
import slugify from "slugify";
import { PencilIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/solid";

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
  const [isModelOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    if (user && likes.includes(user.$id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, []);

  function generateTagId(tag) {
    return slugify(tag, {
      lower: true,
      remove: /[^a-zA-Z0-9]/g, // Remove special characters and spaces
    });
  }

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

  const handleShareClick = () => {
    setIsModelOpen(true);
  };

  const handleDelete = () => {
    databases
      .deleteDocument(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_COLLECTION_ID,
        craftid
      )
      .then((res) => {
        console.log(res);
        window.location.href = "/";
      })
      .catch((err) => console.log(err));
  };


  return (
    <div className="relative">
      <div className="sm:absolute top-10 right-[40px] pt-[40px] md:w-[40px] md:h-full  h-[40px] hidden sm:block">
        <div className="sticky top-20 flex md:flex-col gap-4 h-[40px] ">
          <Link to={`/users/${userid}`}>
            <img
              src={profilePic}
              alt=""
              className="h-[40px] w-[40px] rounded-full"
            />
          </Link>
          {user && user.$id == userid && (
            <div className="flex justify-end">
              <Link
                to={`/editcraft/${craftid}`}
                className="bg-gray-200 rounded-full fill-gray-600 p-3"
              >
                <PencilIcon className="h-4 w-4 fill-black opacity-60" />
              </Link>
            </div>
          )}
          {user && user.$id == userid && (
            <div className="flex justify-end">
              <button
                className="bg-gray-200 rounded-full fill-gray-600 p-3"
                onClick={handleDelete}
              >
                <TrashIcon className="h-4 w-4 fill-black opacity-60" />
              </button>
            </div>
          )}

          <Share />
          <div className="h-[40px] w-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
            <CommentComponent />
          </div>
        </div>
      </div>
      <Container className="md:px-[68px] md:py-[120px] md:pb-[0px] p-5 pt-10 mb-10">
        <div className="mx-auto max-w-7xl">
          <div className="felx md:mx-[44px]">
            <div className="w-full px-6 md:px-20 m-auto flex flex-col md:flex-row justify-between items-start md:items-end ">
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

                  {user && user.$id == userid && (
                    <div className="flex justify-end">
                      <Link
                        to={`/editcraft/${craftid}`}
                        className="bg-gray-200 rounded-full fill-gray-600 p-3"
                      >
                        <PencilIcon className="h-4 w-4 fill-black opacity-60" />
                      </Link>
                    </div>
                  )}
                  {user && user.$id == userid && (
                    <div className="flex justify-end">
                      <button
                        className="bg-gray-200 rounded-full fill-gray-600 p-3"
                        onClick={handleDelete}
                      >
                        <TrashIcon className="h-4 w-4 fill-black opacity-60" />
                      </button>
                    </div>
                  )}

                  <div
                    className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer"
                    onClick={handleShareClick}
                  >
                    <img
                      src={share}
                      className="opacity-60 h-full"
                      alt="Share"
                    />
                  </div>
                  {isModelOpen && (
                    <div
                      className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-10"
                      onClick={() => setIsModelOpen(false)}
                    >
                      <div
                        className="bg-white p-6 rounded-lg flex flex-col gap-4 "
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded "
                          onClick={() => setIsModelOpen(false)}
                        >
                          close
                        </button>
                        <ShareComponent
                          url="https://saipranay.vercel.app"
                          text="check out my portfolio"
                        />
                      </div>
                    </div>
                  )}
                  {/* <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                    <img src={save} className="opacity-60 h-full" />
                  </div> */}
                  <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
                    <CommentComponent />
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

                <ButtonUrl
                  color="white"
                  href={liveLink}
                  className="max-md:text-[12px]"
                >
                  Live site
                </ButtonUrl>
                <ButtonUrl
                  color="white"
                  href={sourceCode}
                  className="max-md:text-[12px]"
                >
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
                  <a
                    className="active:scale-[0.95] transition-all"
                    href={`/tags/${generateTagId(tag)}`} // Generate the ID for the tag
                    key={tag}
                  >
                    <div className="text-slate-600 dark:text-zinc-200 text-sm border border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 px-1 py-1 pr-2 rounded-xl">
                      <span className="bg-slate-100 dark:bg-zinc-800 dark:text-zinc-500 inline-block p-0.5 px-1 mr-1 rounded-lg leading-none">
                        #
                      </span>
                      {tag}
                    </div>
                  </a>
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
      <UserCrafts userid={userid} limit={true} />
    </div>
  );
}

export default CardModel;
