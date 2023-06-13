import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { databases } from "../utils/appwrite";
import { ID, Query } from "appwrite";

function CommentComponent({ craftid, comments, user }) {
  const [dbcomments, setDBComments] = useState(comments);
  const [open, setOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (craftid) {
      setLoading(true);
      databases
        .listDocuments(
          import.meta.env.VITE_PUBLIC_DATABASE_ID,
          import.meta.env.VITE_PUBLIC_COMMENTS_COLLECTION_ID,
          [Query.equal("craftid", craftid), Query.orderAsc("$createdAt")]
        )
        .then((response) => {
          setDBComments(response.documents);
          console.log(response.documents);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch user crafts:", error);
        });
    }
  }, [craftid]);

  const handleCommentDelete = (commentid) => {
    try {
      databases
        .deleteDocument(
          import.meta.env.VITE_PUBLIC_DATABASE_ID,
          import.meta.env.VITE_PUBLIC_COMMENTS_COLLECTION_ID,
          commentid
        )
        .then((response) => {
          console.log(response);
          setDBComments(
            dbcomments.filter((comment) => comment.$id !== commentid)
          );
        })
        .catch((error) => {
          console.error("Failed to delete document:", error);
        });
    } catch (error) {
      console.log(error);
    }
    console.log("delete");
    console.log(commentid);
  };

  const handleCommentSubmit = () => {
    if (commentInput) {
      const newComment = {
        username: user.name,
        userid: user.$id,
        text: commentInput,
        imgurl: user.prefs?.photo,
        craftid: craftid,
      };

      try {
        databases
          .createDocument(
            import.meta.env.VITE_PUBLIC_DATABASE_ID,
            import.meta.env.VITE_PUBLIC_COMMENTS_COLLECTION_ID,
            ID.unique(),
            newComment
          )
          .then((response) => {
            console.log(response);
            setDBComments([...dbcomments, response]);
            setCommentInput("");
          })
          .catch((error) => {
            console.error("Failed to create document:", error);
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <button
        className={`h-[40px] p-[13px] bg-gray-200 fill-gray-600 rounded-full flex justify-center items-center cursor-pointer ${
          open ? "bg-blue-500 text-white" : ""
        }`}
        onClick={() => setOpen(!open)}
        disabled={user ? false : true}
        style={{ cursor: user ? "pointer" : "not-allowed" }}
      >
        <ChatBubbleLeftRightIcon
          className="h-full opacity-60 fill-black"
          aria-hidden="true"
        />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          open={open}
          onClose={setOpen}
        >
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-zinc-900 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="p-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Comments
                  </h3>

                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="mt-2">
                      {dbcomments?.length === 0 ? (
                        <div className="flex flex-col gap-4 items-center justify-center w-full">
                          <p className="text-gray-500">No comments yet</p>
                        </div>
                      ) : (
                        dbcomments.map((comment) => (
                          <div
                            key={comment.id}
                            className="flex items-center justify-between py-1 px-1 "
                          >
                            <div className="flex items-center py-2 ">
                              <div className="flex-shrink-0">
                                <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                                  {comment.imgurl ? (
                                    <img
                                      src={comment.imgurl}
                                      alt=""
                                      className="rounded-full w-full"
                                    />
                                  ) : (
                                    <span className="text-gray-500 mb-1 text-xl">
                                      {comment.username.charAt(0)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">
                                  {comment.username}
                                </p>
                                <p className="mt-1 text-sm text-gray-700">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                            {user?.$id == comment.userid ? (
                              <TrashIcon
                                className="w-5 cursor-pointer "
                                onClick={() => handleCommentDelete(comment.$id)}
                              />
                            ) : null}
                          </div>
                        ))
                      )}
                      <div className="w-full">
                        <div className="flex gap-4 px-4 pt-2">
                          <input
                            type="text"
                            placeholder="share your thougthts"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyPress={(e) => {
                              e.key === "Enter" ? handleCommentSubmit() : null;
                            }}
                            className="block w-full appearance-none rounded-md border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm border-2"
                          />

                          <PaperAirplaneIcon
                            className="w-6  fill-gray-600 -rotate-45 mb-1 cursor-pointer"
                            onClick={handleCommentSubmit}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default CommentComponent;
