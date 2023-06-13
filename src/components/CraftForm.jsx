import React, { useState, useEffect } from "react";
import { Button } from "./Button";
import { ButtonLink } from "./Button";
import { databases, storage } from "../utils/appwrite";
import { ID, Query } from "appwrite";
import { useNavigate } from "react-router-dom";
import Card from "./Card";
import placeholder from "../images/placeholder.png";
import CardUrl from "./CardUrl";
import profilePlaceholder from "../images/profilePlaceholder.jpeg";

function CraftForm({ auth, craft }) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // tags input
  const [inptags, setInptags] = useState([]);

  const [tagInput, setTagInput] = useState();

  const [dbTags, setDbTags] = useState([]);
  const [suggestedTags, setSuggestedTags] = useState([]);

  const [newTags, setNewTags] = useState([]);

  const [photo, setPhoto] = useState(placeholder);

  useEffect(() => {
    if(auth){
      setPhoto(auth.prefs?.photo);
    }
  }, [auth]);

  const getTags = async () => {
    try {
      const res = await databases.listDocuments(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_TAGS_COLLECTION_ID
      );

      let allTags = res.documents.map((doc) => doc.tag);

      if (res.total > 25) {
        let offset = 25;
        while (offset < res.total) {
          const res2 = await databases.listDocuments(
            import.meta.env.VITE_PUBLIC_DATABASE_ID,
            import.meta.env.VITE_PUBLIC_TAGS_COLLECTION_ID,
            [Query.limit(25), Query.offset(offset)]
          );
          const tags = res2.documents.map((doc) => doc.tag);
          allTags = [...allTags, ...tags];
          offset += 25;
        }
      }

      setDbTags(allTags);
      console.log(allTags);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTags();
  }, []);

  const handleTagInputChange = (e) => {
    const inputValue = e.target.value;

    if (/[^a-zA-Z0-9]+/.test(inputValue.trim())) {
      setErrors({
        ...errors,
        tags: "Tags should only contain alphanumeric characters",
      });
    } else if (inputValue.trim().length > 24) {
      setErrors({
        ...errors,
        tags: `Tag cannot exceed ${24} characters`,
      });
    } else {
      setErrors({ ...errors, tags: "" });
    }

    setTagInput(inputValue);
    if (inputValue.length > 0) {
      const matchingTags = dbTags.filter(
        (tag) =>
          tag.toLowerCase().startsWith(inputValue.toLowerCase()) &&
          !inptags.includes(tag) // Exclude already entered tags from suggestions
      );

      setSuggestedTags(matchingTags);
    } else {
      setSuggestedTags([]);
    }
  };

  const handleSuggestedTagClick = (tag) => {
    setInptags([...inptags, tag.toLowerCase()]);
    setTagInput("");
    setSuggestedTags([]);
  };

  const handleCreateTag = () => {
    const newTag = tagInput.trim();

    if (newTag !== "") {
      if (inptags.length >= 10) {
        setErrors({
          ...errors,
          tags: `You can only add up to ${10} tags`,
        });
        return;
      }

      if (newTag.length > 24) {
        setErrors({
          ...errors,
          tags: `Tag cannot exceed ${24} characters`,
        });
        return;
      }

      if (inptags.includes(newTag.toLowerCase())) {
        setErrors({
          ...errors,
          tags: "Tag already exists",
        });
        return;
      }

      setErrors({ ...errors, tags: "" });

      setInptags([...inptags, newTag]);
      setTagInput("");
      setSuggestedTags([]);
      console.log(`Create ${newTag}`);
      setNewTags([...newTags, newTag]);
    }
  };

  const createNewTags = async () => {
    try {
      if (newTags.length > 0) {
        for (const tag of newTags) {
          await databases.createDocument(
            import.meta.env.VITE_PUBLIC_DATABASE_ID,
            import.meta.env.VITE_PUBLIC_TAGS_COLLECTION_ID,
            tag,
            {
              tag: tag,
              count: 0,
            }
          );
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [errors, setErrors] = useState({
    title: "",
    liveLink: "",
    sourceCodeLink: "",
    tags: "",
    image: "",
    description: "",
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Validate title
    if (values.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters";
      isValid = false;
    } else if (values.title.length === 0) {
      newErrors.title = "Title is required";
      isValid = false;
    } else {
      newErrors.title = "";
    }

    // Validate live link
    if (!values.liveLink.match(/^https?:\/\/.+$/)) {
      newErrors.liveLink = "Invalid live link URL";
      isValid = false;
    } else if (values.liveLink.length === 0) {
      newErrors.liveLink = "Live link is required";
      isValid = false;
    } else {
      newErrors.liveLink = "";
    }

    // Validate source code link
    if (!values.sourceCodeLink.match(/^https?:\/\/.+$/)) {
      newErrors.sourceCodeLink = "Invalid source code link URL";
      isValid = false;
    } else if (values.sourceCodeLink.length === 0) {
      newErrors.sourceCodeLink = "Source code link is required";
      isValid = false;
    } else {
      newErrors.sourceCodeLink = "";
    }

    // Validate tags
    for (const tag of values.tags) {
      if (tag.length > 24) {
        newErrors.tags = "Tag cannot exceed 24 characters";
        isValid = false;
        break;
      }

      const tagPattern = /^[a-zA-Z0-9]+$/; // Pattern to match only alphanumeric characters
      if (!tagPattern.test(tag)) {
        newErrors.tags = "Tags should only contain alphanumeric characters";
        isValid = false;
        break;
      }
    }

    if (values.tags.length === 0) {
      newErrors.tags = "At least one tag is required";
      isValid = false;
    } else {
      newErrors.tags = "";
    }

    // Validate image
    if (craft) {
      newErrors.image = "";
    } else {
      if (image && !["image/png", "image/jpeg"].includes(image.type)) {
        newErrors.image = "Invalid image format (PNG or JPEG allowed)";
        isValid = false;
      } else if (!image) {
        newErrors.image = "Image is required";
        isValid = false;
      } else {
        newErrors.image = "";
      }
    }

    // Validate description
    if (values.description.length > 1000) {
      newErrors.description = "Description cannot exceed 1000 characters";
      isValid = false;
    } else if (values.description.length === 0) {
      newErrors.description = "Description is required";
      isValid = false;
    } else {
      newErrors.description = "";
    }

    setErrors(newErrors);
    return isValid;
  };

  const removeTags = (indexToRemove) => {
    setInptags(inptags.filter((_, index) => index !== indexToRemove));
  };

  // values

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
      if (image) {
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
        // await createDoc(updatedValues);
        if (craft) {
          await updateDoc(updatedValues);
        } else {
          await createDoc(updatedValues);
        }
      } else {
        if (craft) {
          await updateDoc(values);
        } else {
          await createDoc(values);
        }
      }
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

    if (validateForm()) {
      await createNewTags();
      await imageUpload();
    }
    setLoading(false);
  };

  const handleUpdate = async (e) => {
    console.log("update");
    e.preventDefault();
    setLoading(true);

    if (validateForm()) {
      await createNewTags();
      await imageUpload();
      // await updateDoc(values);
    } else {
      console.log("not valid");
      console.log(errors);
    }
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

  const updateDoc = async (valuess) => {
    console.log("collection:" + import.meta.env.VITE_PUBLIC_DATABASE_ID);
    try {
      const promise = await databases.updateDocument(
        import.meta.env.VITE_PUBLIC_DATABASE_ID,
        import.meta.env.VITE_PUBLIC_COLLECTION_ID,
        craft.$id,
        valuess
      );
      console.log(promise);
      navigate("/craft/" + craft.$id);
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

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (craft) {
      setValues({
        title: craft.title,
        liveLink: craft.liveLink,
        sourceCodeLink: craft.sourceCodeLink,
        tags: craft.tags,
        imgid: craft.imgid,
        description: craft.description,
        username: craft.username,
        uid: craft.uid,
      });
      setInptags(craft.tags);

      if (craft.imgid) {
        try {
          const result = storage.getFilePreview(
            import.meta.env.VITE_PUBLIC_BUCKET_ID,
            craft.imgid
          );
          setImageUrl(result.href);
        } catch (error) {
          console.log(error);
        }
      }
    }
  }, [craft]);

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
                  <div className="col-span-full">
                    <label className="block mb-3 text-sm font-medium text-gray-200">
                      Project Title
                    </label>
                    <input
                      className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="Developer Portfolio website"
                      value={values.title}
                      onChange={(e) => {
                        if (e.target.value.length <= 100) {
                          setValues({ ...values, title: e.target.value });
                          setErrors({ ...errors, title: "" });
                        } else {
                          setErrors({
                            ...errors,
                            title: "Title cannot exceed 100 characters",
                          });
                        }
                      }}
                    />
                    {errors.title && (
                      <p className="text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="col-span-full">
                    <label className="block mb-3 text-sm font-medium text-gray-200">
                      Live website link
                    </label>
                    <input
                      className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="https://example.com"
                      value={values.liveLink}
                      onChange={(e) => {
                        if (e.target.value.match(/^https?:\/\/.+$/)) {
                          setValues({ ...values, liveLink: e.target.value });
                          setErrors({ ...errors, liveLink: "" });
                        } else {
                          setValues({ ...values, liveLink: e.target.value });
                          setErrors({
                            ...errors,
                            liveLink: "Invalid live link URL",
                          });
                        }
                      }}
                    />
                    {errors.liveLink && (
                      <p className="text-red-500">{errors.liveLink}</p>
                    )}
                    <Button
                      color="blue"
                      className="rounded-md mt-3"
                      onClick={getOgData}
                    >
                      Get meta data
                    </Button>
                  </div>

                  <div className="col-span-full">
                    <label className="block mb-3 text-sm font-medium text-gray-200">
                      Link to source code
                    </label>
                    <input
                      className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                      placeholder="https://github.com/jhon/portfolio"
                      value={values.sourceCodeLink}
                      onChange={(e) => {
                        if (e.target.value.match(/^https?:\/\/.+$/)) {
                          setValues({
                            ...values,
                            sourceCodeLink: e.target.value,
                          });
                          setErrors({ ...errors, sourceCodeLink: "" });
                        } else {
                          setValues({
                            ...values,
                            sourceCodeLink: e.target.value,
                          });
                          setErrors({
                            ...errors,
                            sourceCodeLink: "Invalid source code link URL",
                          });
                        }
                      }}
                    />
                    {errors.sourceCodeLink && (
                      <p className="text-red-500">{errors.sourceCodeLink}</p>
                    )}
                  </div>

                  {/* tags imput */}
                  <div className="col-span-full">
                    <label className="block mb-3 text-sm font-medium text-gray-200">
                      Relevant Tags
                    </label>
                    <div className="items-center w-full px-3 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl sm:text-sm">
                      <div className="ml-2">
                        <input
                          className="w-full px-1 py-1 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="Add tags"
                          value={tagInput}
                          onChange={handleTagInputChange}
                        />
                      </div>
                      <div className="flex flex-wrap items-center justify-start gap-2">
                        {inptags.map((tag, index) => (
                          <span
                            className="py-2 bg-[#10101D] text-gray-200 pl-4 pr-3 rounded-full flex items-center"
                            key={index}
                          >
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
                    {errors.tags && (
                      <p className="text-red-500">{errors.tags}</p>
                    )}
                    {tagInput?.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-400">Select tag:</p>
                        <div className="flex flex-wrap mt-1">
                          {suggestedTags.map((tag) => (
                            <button
                              key={tag}
                              className="py-1 px-2 mr-2 mt-2 bg-gray-200 text-gray-700 rounded-md text-sm"
                              onClick={() => handleSuggestedTagClick(tag)}
                            >
                              {tag}
                            </button>
                          ))}

                          {tagInput.trim() !== "" &&
                            suggestedTags.length === 0 &&
                            errors.tags === "" && (
                              <button
                                className="py-1 px-2 mr-2 mt-2 bg-gray-200 text-gray-700 rounded-md text-sm"
                                onClick={handleCreateTag}
                              >
                                Create {tagInput}
                              </button>
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-span-full">
                    <label htmlFor="small-file-input" className="sr-only">
                      Choose file
                    </label>
                    <input
                      type="file"
                      name="small-file-input"
                      id="small-file-input"
                      className="block w-full border shadow-sm rounded-md text-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 bg-slate-50 border-gray-300 text-gray-800 file:bg-transparent file:border-0 file:bg-gray-400 file:mr-4 file:py-2 file:px-4  file:text-gray-800"
                      onChange={(e) => setImage(e.target.files[0])}
                    ></input>
                  </div>

                  <div>
                    <div className="col-span-full">
                      <label className="block mb-3 text-sm font-medium text-gray-200">
                        Description
                      </label>
                      <textarea
                        className="block w-full px-6 py-3 text-black bg-white border border-gray-200 appearance-none rounded-xl placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                        placeholder="Enter project description"
                        value={values.description}
                        onChange={(e) => {
                          if (e.target.value.length <= 1000) {
                            setValues({
                              ...values,
                              description: e.target.value,
                            });
                            setErrors({ ...errors, description: "" });
                          } else {
                            setErrors({
                              ...errors,
                              description:
                                "Description cannot exceed 1000 characters",
                            });
                          }
                        }}
                      />
                      <p className="text-sm text-gray-500">
                        {values.description.length}/1000
                      </p>
                      {errors.description && (
                        <p className="text-red-500">{errors.description}</p>
                      )}
                    </div>
                  </div>
                  {craft ? (
                    <div className="col-span-full">
                      <Button
                        variant="solid"
                        color="blue"
                        className="w-full"
                        onClick={handleUpdate}
                      >
                        Update your work
                      </Button>
                    </div>
                  ) : (
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
                  )}
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
                profilepic={photo}
              />
            ) : imageUrl ? (
              <CardUrl
                title={values.title}
                tags={values.tags}
                description={values.description}
                image={imageUrl}
                username={values.username}
                profilepic={photo}
              />
            ) : (
              <CardUrl
                title={values.title}
                tags={values.tags}
                description={values.description}
                image={placeholder}
                username={values.username}
                profilepic={photo}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CraftForm;
