import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { ButtonLink } from "./Button";
import { databases, storage } from "../utils/appwrite";
import { ID } from "appwrite";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import placeholder from "../images/placeholder.png"
import CardUrl from "./CardUrl";

function CraftForm({auth}) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // tags input
  const [inptags, setInptags] = useState([]);

  const addTags = (event) => {
    if (event.key === "Enter" && event.target.value !== "") {
      setInptags([...inptags, event.target.value]);
      event.target.value = "";
    }
  };

  const removeTags = (indexToRemove) => {
    setTags(inptags.filter((_, index) => index !== indexToRemove));
  };

  // values
  const [values, setValues] = useState({
    title: "",
    liveLink: "",
    sourceCodeLink: "",
    tags: inptags,
    imgid: "",
    description: "",
    username: auth.name,
    uid: auth.$id,
  });

  const [image, setImage] = useState();

  useEffect(() => {
    // Update the OG image tag whenever the `image` state changes
    if (image) {
      const metaTags = document.getElementsByTagName("meta");
      for (let i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute("property") === "og:image") {
          metaTags[i].setAttribute("content", image);
        }
      }
    }
  }, [image]);

  const getOG = async (url) => {
    try {
      const response = await fetch(
        `https://api.linkpreview.net/?key=e0e295f53dd0815d46acc95f6dfdfbb8&q=${url}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  const imageUpload = async () => {
    try {
      const promise = await storage.createFile(
        import.meta.env.VITE_PUBLIC_BUCKET_ID,
        ID.unique(),
        image
      );

      console.log(promise);

      const updatedValues = {
        ...values,
        imgid: promise.$id,
      };

      setValues(updatedValues);
      console.log(updatedValues);
      await createDoc(updatedValues);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setValues((prevValues) => ({
      ...prevValues,
      tags: inptags,
    }));
  }, [inptags]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await imageUpload();
    setLoading(false);
  };

  // creaate doctument in appwrite
  const createDoc = async (valuess) => {
    console.log("collection:" + import.meta.env.VITE_PUBLIC_DATABASE_ID);
    try {
      const promise = await databases.createDocument(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_COLLECTION_ID,
        ID.unique(),
        valuess,
        undefined
      );
      console.log(promise);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const getOgData = async (event) => {
    const url = values.liveLink;

    if (url !== "") {
      const ogdata = await getOG(url);

      if (ogdata.error) {
        console.log("Error getting OG data: " + ogdata.error);
      } else {
        setValues({
          ...values,
          title: ogdata.title,
          description: ogdata.description,
        });

        if (ogdata.image === undefined || ogdata.image == "") {
          return console.log("no image" + ogdata.image);
        } else {
          try {
            const response = await fetch(ogdata.image);
            const blob = await response.blob();

            const file = new File([blob], "ogimage.jpg", { type: blob.type });

            setImage(file);
          } catch (error) {
            console.log(error);
          }
        }
      }
    } else {
      setImage(null);
    }
  };

  

  return (
    <div className="h-full pt-10">
      <nav className="flex justify-center bg-[#10101D] ">
        <div className="z-50 py-5 px-8 w-full m-auto max-w-screen-xl flex justify-between items-center fixed top-0 bg-[#10101D]">
          <ButtonLink
            variant="outline"
            color="white"
            className=" rounded-md"
            href="/"
          >
            Cancel
          </ButtonLink>
          <Button variant="solid" color="blue" className="rounded-md ">
            Continue
          </Button>
        </div>
      </nav>

      <section className="bg-[#10101D]">
        <h2 className="text-4xl font-semibold text-white text-center mt-16  max-sm:text-xl">
          What have you been working on?
        </h2>
        <div className="relative flex-wrap flex justify-between max-h-full overflow-hidden lg:px-0 md:px-12 py-5">
          <div className="relative flex flex-col  px-4 py-10 text-white shadow-2xl  sm:justify-center">
            <div className="w-full max-w-md sm:px-4">
              <div className="flex flex-col">
                <div>
                  <p className="mt-2 text-sm text-gray-300">
                    Submit your web dev projects and enhance your skills, gain
                    insights, and connect with fellow developers on WebCrafts.
                  </p>
                </div>
              </div>
              <div>
                <input name="hidden" className="hidden" />
                <input name="_redirect" type="hidden" value="#" />
                <div className="mt-4 space-y-6">
                  <div>
                    <label
                      className="block mb-3 text-sm font-medium text-gray-200"
                      name="title"
                    >
                      Project Title
                    </label>
                    <input
                      className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="Developer Portfolio website"
                      value={values.title}
                      onChange={(e) =>
                        setValues({ ...values, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="col-span-full">
                    <label
                      className="block mb-3 text-sm font-medium text-gray-200"
                      name="liveLink"
                    >
                      Live website link
                    </label>
                    <input
                      className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="https://example.com"
                      value={values.liveLink}
                      onChange={(e) =>
                        setValues({ ...values, liveLink: e.target.value })
                      }
                    />
                    <br />
                    <Button
                      color="blue"
                      className="rounded-md"
                      onClick={getOgData}
                    >
                      Get meta data
                    </Button>
                  </div>
                  <div className="col-span-full">
                    <label
                      className="block mb-3 text-sm font-medium text-gray-200"
                      name="sourceCodeLink"
                    >
                      Link to source code
                    </label>
                    <input
                      className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="https://github.com/jhon/portfolio"
                      value={values.sourceCodeLink}
                      onChange={(e) =>
                        setValues({ ...values, sourceCodeLink: e.target.value })
                      }
                    />
                  </div>

                  {/* tags imput */}
                  <div className="col-span-full">
                    <label
                      className="block mb-3 text-sm font-medium text-gray-200"
                      name="tags"
                    >
                      Relavent Tags
                    </label>
                    <div className="items-center w-full px-3 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl  sm:text-sm">
                      <div className="ml-2">
                        <input
                          className="w-full px-1 py-1 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="Add tags"
                          onKeyUp={addTags}
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-start gap-2 ">
                        {inptags.map((tag, index) => (
                          <span className="py-2 bg-[#10101D] text-gray-200 pl-4 pr-3 rounded-full flex items-center">
                            {tag}

                            <button
                              className="ml-1"
                              onClick={() => removeTags(index)}
                            >
                              <svg
                                stroke="currentColor"
                                fill="currentColor"
                                viewBox="0 0 512 512"
                                height="1.5em"
                                width="1.5em"
                              >
                                <path d="M256 48C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48zm52.7 283.3L256 278.6l-52.7 52.7c-6.2 6.2-16.4 6.2-22.6 0-3.1-3.1-4.7-7.2-4.7-11.3 0-4.1 1.6-8.2 4.7-11.3l52.7-52.7-52.7-52.7c-3.1-3.1-4.7-7.2-4.7-11.3 0-4.1 1.6-8.2 4.7-11.3 6.2-6.2 16.4-6.2 22.6 0l52.7 52.7 52.7-52.7c6.2-6.2 16.4-6.2 22.6 0 6.2 6.2 6.2 16.4 0 22.6L278.6 256l52.7 52.7c6.2 6.2 6.2 16.4 0 22.6-6.2 6.3-16.4 6.3-22.6 0z"></path>
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label htmlFor="small-file-input" className="sr-only">
                      Choose file
                    </label>
                    <input
                      type="file"
                      name="small-file-input"
                      id="small-file-input"
                      className="block w-full border border-gray-200 shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-gray-400 file:bg-transparent file:border-0 file:bg-gray-100 file:mr-4 file:py-2 file:px-4 dark:file:bg-gray-700 dark:file:text-gray-400"
                      onChange={(e) => setImage(e.target.files[0])}
                    ></input>
                  </div>

                  <div>
                    <div>
                      <label
                        className="block mb-3 text-sm font-medium text-gray-200"
                        name="description"
                      >
                        Project details
                      </label>
                      <div className="mt-1">
                        <textarea
                          className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          placeholder="short description about your poject"
                          rows="4"
                          value={values.description}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              description: e.target.value,
                            })
                          }
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-full">
                    <Button
                      variant="solid"
                      color="blue"
                      className="w-full"
                      onClick={handleSubmit}
                    >
                      Submit your work
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-center lg:w-1/2">
            {loading ? (
              <div className="w-[500px] h-[350px] bg-white rounded-lg flex justify-center items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-10 w-10 text-sky-500"
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
                    strokeWidth={4}
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>{" "}
              </div>
            ) : image ? (
              <CardUrl
                title={values.title}
                tags={values.tags}
                description={values.description}
                image={URL.createObjectURL(image)}
                username={values.username}
              />
            ) : (
              <CardUrl
                title={values.title}
                tags={values.tags}
                description={values.description}
                image={placeholder}
                username={values.username}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CraftForm;
