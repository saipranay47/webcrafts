import React, { useState, useEffect } from "react";
import { useUser } from "../hooks/user";
import { Link } from "react-router-dom";
import { Header } from "./Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [coverPhoto, setCoverPhoto] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState("");
  const [selectedCoverPhoto, setSelectedCoverPhoto] = useState("");
  const [validPhoto, setValidPhoto] = useState(false);
  const [validCoverPhoto, setValidCoverPhoto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [hashnodeUsername, setHashnodeUsername] = useState("");

  const navigate = useNavigate();

  const { user } = useUser();

  useEffect(() => {
    if (user) {
      setUsername(user.$id);
      setName(user.name);
      if (user.pref) {
        if (user.pref.photo) {
          setSelectedPhoto(user.pref.photo);
        }
        if (user.pref.coverPhoto) {
          setSelectedCoverPhoto(user.pref.coverPhoto);
        }
        if (user.pref.githubUsername) {
          setGithubUsername(user.pref.github);
        }
      }

      // Retrieve and store user preferences
      axios
        .get(`https://cloud.appwrite.io/v1/users/${user.$id}/prefs`, {
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Response-Format": "1.0.0",
            "X-Appwrite-Project": "64731016883a2d49ac15",
            "X-Appwrite-Key":
              "57db0f34f2b14a4b380d1d252f8169e995c1f946727a34269107bdffa2b3423ac9543392cca93da16bfd6df2884ddc7aba438fb63cc96ec799a8959fac9caeb490c7363fffcd45ba6904ae18c2e4bca1ce429a2b84c860342832eb12c8f00bdcacc3fef7ba1e289dcaf87417f9f792b3d0b7c1f2a0be697781874100745045a9",
          },
        })
        .then((response) => {
          const { photo, coverPhoto, github, hashnode } = response.data;

          if (photo) {
            setSelectedPhoto(photo);
          }
          if (coverPhoto) {
            setSelectedCoverPhoto(coverPhoto);
          }
          if (github) {
            setGithubUsername(github);
          }
          if (hashnode) {
            setHashnodeUsername(hashnode);
          }
        })
        .catch((error) => {
          console.error("Failed to retrieve user preferences:", error);
          // Handle error notifications or show error messages
        });
    }
  }, [user]);

  const updateName = () => {
    axios
      .patch(
        `https://cloud.appwrite.io/v1/users/${user.$id}/name`,
        {
          name: name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Response-Format": "1.0.0",
            "X-Appwrite-Project": "64731016883a2d49ac15",
            "X-Appwrite-Key":
              "57db0f34f2b14a4b380d1d252f8169e995c1f946727a34269107bdffa2b3423ac9543392cca93da16bfd6df2884ddc7aba438fb63cc96ec799a8959fac9caeb490c7363fffcd45ba6904ae18c2e4bca1ce429a2b84c860342832eb12c8f00bdcacc3fef7ba1e289dcaf87417f9f792b3d0b7c1f2a0be697781874100745045a9",
          },
        }
      )
      .then((response) => {
        console.log("Name updated successfully:", response.data);
      })
      .catch((error) => {
        console.error("Failed to update name:", error);
        // Handle error notifications or show error messages
      });
  };


  const handlePhotoInputChange = (e) => {
    setSelectedPhoto(e.target.value);
  };

  const handleCoverPhotoInputChange = (e) => {
    setSelectedCoverPhoto(e.target.value);
  };

  const validateImageURLs = () => {
    const photoImg = new Image();
    const coverPhotoImg = new Image();

    photoImg.onload = () => {
      setValidPhoto(true);
    };

    photoImg.onerror = () => {
      setValidPhoto(false);
    };

    coverPhotoImg.onload = () => {
      setValidCoverPhoto(true);
    };

    coverPhotoImg.onerror = () => {
      setValidCoverPhoto(false);
    };

    photoImg.src = selectedPhoto;
    coverPhotoImg.src = selectedCoverPhoto;
  };

  const updatePrefs = () => {
    const prefs = {
      photo: selectedPhoto,
      coverPhoto: selectedCoverPhoto,
    };

    axios
      .patch(
        `https://cloud.appwrite.io/v1/users/${user.$id}/prefs`,
        {
          prefs: {
            ...user.prefs,
            photo: selectedPhoto,
            coverPhoto: selectedCoverPhoto,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Response-Format": "1.0.0",
            "X-Appwrite-Project": "64731016883a2d49ac15",
            "X-Appwrite-Key":
              "57db0f34f2b14a4b380d1d252f8169e995c1f946727a34269107bdffa2b3423ac9543392cca93da16bfd6df2884ddc7aba438fb63cc96ec799a8959fac9caeb490c7363fffcd45ba6904ae18c2e4bca1ce429a2b84c860342832eb12c8f00bdcacc3fef7ba1e289dcaf87417f9f792b3d0b7c1f2a0be697781874100745045a9",
          },
        }
      )
      .then((response) => {
        console.log("Preferences updated successfully:", response.data);
        navigate("/profile");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Failed to update preferences:", error);
        // Handle error notifications or show error messages
      });
  };

  const handleSave = (e) => {
    setLoading(true);
    e.preventDefault();
    updateName();
    validateImageURLs();

    if (validPhoto || validCoverPhoto) {
      console.log("Saving profile...");
      updatePrefs();
    }
    setLoading(false);
  };

  const handleSaveWidget = (e) => {
    setLoading(true);
    e.preventDefault();

    axios
      .patch(
        `https://cloud.appwrite.io/v1/users/${user.$id}/prefs`,
        {
          prefs: {
            ...user.prefs,
            github: githubUsername,
            hashnode: hashnodeUsername,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-Appwrite-Response-Format": "1.0.0",
            "X-Appwrite-Project": "64731016883a2d49ac15",

            "X-Appwrite-Key":
              "57db0f34f2b14a4b380d1d252f8169e995c1f946727a34269107bdffa2b3423ac9543392cca93da16bfd6df2884ddc7aba438fb63cc96ec799a8959fac9caeb490c7363fffcd45ba6904ae18c2e4bca1ce429a2b84c860342832eb12c8f00bdcacc3fef7ba1e289dcaf87417f9f792b3d0b7c1f2a0be697781874100745045a9",
          },
        }
      )
      .then((response) => {
        console.log("Preferences updated successfully:", response.data);
        navigate("/profile");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Failed to update preferences:", error);
        // Handle error notifications or show error messages
      });
    setLoading(false);
  };

  return (
    <>
      <Header />
      <div className="md:p-20 p-5 min-h-screen">
        {!user ? (
          <div className="w-full h-full min-h-screen flex justify-center items-center">
            <span>
              <Link
                to="/login"
                className="underline font-semibold text-sky-500"
              >
                Login
              </Link>{" "}
              to create your own profile
            </span>
          </div>
        ) : (
          <div>
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-100">
                    Profile
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    This information will be displayed publicly, so be careful
                    what you share.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div>
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-slate-800 space-y-6 sm:p-6">
                      {/* Form fields */}

                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 lg:col-span-2">
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Name
                          </label>

                          <input
                            type="text"
                            name="name"
                            id="name"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-700 bg-gray-800 mt-1"
                            placeholder="steve jobs"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Photo
                          {/* {photoError && (
                            <span className="text-red-500 text-xs ">
                              {" "}
                              {photoError}
                            </span>
                          )} */}
                        </label>
                        <div className="mt-1 flex items-center">
                          {selectedPhoto ? (
                            <img
                              src={selectedPhoto}
                              alt="Selected Photo"
                              className="h-12 w-12 rounded-full"
                            />
                          ) : (
                            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                              <svg
                                className="h-full w-full text-gray-300"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            </span>
                          )}
                          <input
                            type="text"
                            name="photo"
                            id="photo"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-700 bg-gray-800 mt-1 ml-2"
                            placeholder="Enter photo URL"
                            value={selectedPhoto}
                            onChange={handlePhotoInputChange}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300">
                          Cover Photo
                        </label>
                        <input
                          type="text"
                          name="coverPhoto"
                          id="coverPhoto"
                          className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-700 bg-gray-800 my-1"
                          placeholder="Enter cover photo URL"
                          value={selectedCoverPhoto}
                          onChange={handleCoverPhotoInputChange}
                        />
                        <div className="mt-1 flex items-center">
                          {selectedCoverPhoto ? (
                            <img
                              src={selectedCoverPhoto}
                              alt="Selected Cover Photo"
                              className=" h-36 w-full object-cover"
                            />
                          ) : (
                            <div className="h-36 w-full bg-gray-100" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-slate-700 text-right sm:px-6">
                      <button
                        onClick={handleSave}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-slate-800 bg-indigo-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? (
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3
                              .99l3 4.301zM20 12a8 8 0 01-7.06 7.97l-3-4.302A7.962 7.962 0 0116
                              12h4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3
                              -9.01l-3 4.301z"
                            ></path>
                          </svg>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
            <div className="md:grid md:grid-cols-3 md:gap-6">
              <div className="md:col-span-1">
                <div className="px-4 sm:px-0">
                  <h3 className="text-lg font-medium leading-6 text-gray-100">
                    Widgets
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    This information will be displayed publicly, so be careful
                    what you share.
                  </p>
                </div>
              </div>
              <div className="mt-5 md:mt-0 md:col-span-2">
                <div>
                  <div className="shadow sm:rounded-md sm:overflow-hidden">
                    <div className="px-4 py-5 bg-slate-800 space-y-6 sm:p-6">
                      {/* Form fields */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-3 lg:col-span-2">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-300"
                          >
                            github Username
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-700 bg-slate-700text-gray-500 text-sm">
                              https://github.com/
                            </span>
                            <input
                              type="text"
                              name="username"
                              id="username"
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-700 bg-gray-800"
                              placeholder="steve_jobs"
                              value={githubUsername}
                              onChange={(e) =>
                                setGithubUsername(e.target.value)
                              }
                            />
                          </div>
                        </div>
                        <div className="col-span-3 lg:col-span-2">
                          <label
                            htmlFor="username"
                            className="block text-sm font-medium text-gray-300"
                          >
                            Hashnode Blog link
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <input
                              type="url"
                              name="username"
                              id="username"
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-700 bg-gray-800"
                              placeholder="steve_jobs"
                              value={hashnodeUsername}
                              onChange={(e) =>
                                setHashnodeUsername(e.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-slate-700 text-right sm:px-6">
                      <button
                        onClick={handleSaveWidget}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-slate-800 bg-indigo-400 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        {loading ? (
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-800"
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
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3
                              .99l3 4.301zM20 12a8 8 0 01-7.06 7.97l-3-4.302A7.962 7.962 0 0116
                              12h4zm-2-5.291A7.962 7.962 0 0120 12h4c0-3.042-1.135-5.824-3
                              -9.01l-3 4.301z"
                            ></path>
                          </svg>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
