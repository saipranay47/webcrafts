import React, { useState, useEffect } from "react";
import { storage } from "../utils/appwrite";
import { Transition } from "@headlessui/react";
import CardModel from "./CardModel";

function Card({
  title,
  description,
  tags,
  username,
  image,
  liveLink,
  sourceCode,
  userid,
  craftid,
  likes,
  likeCount,
  ...props
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state for modal open/close

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const loadImageUrl = async () => {
    try {
      const result = await storage.getFilePreview(
        import.meta.env.VITE_PUBLIC_BUCKET_ID,
        image
      );
      console.log(result.href);
      setImageUrl(result.href);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (image) {
      loadImageUrl();
    }
  }, [image]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="bg-[#202020] rounded-xl max-w-sm laptop:max-w-md w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={openModal} // Open the modal on click
        {...props}
      >
        <article className="group max-w-md relative bg-[#202020] rounded-xl w-full">
          {imageUrl && (
            <img
              alt="image"
              src={imageUrl}
              className="h-56 laptop:h-64 w-full rounded-xl object-cover shadow-xl transition group-hover:grayscale-[50%] shadow-[#30303030]"
            />
          )}
          <Transition
            show={isHovered}
            enter="transition-opacity duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {(ref) => (
              <div
                ref={ref}
                className="absolute inset-0 flex items-end justify-center opacity-100 cursor-pointer w-full rounded-xl "
              >
                <div className="flex flex-col justify-evenly w-full px-8 py-4 pt-12 bg-gradient-to-t from-[#000000ea] via-[#0000009f] to-[#00000000] rounded-xl">
                  <span className="line-clamp-1">
                    <span className="font-semibold">{title} </span>
                    {description}
                  </span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="font-normal text-sm rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Transition>
        </article>
        <div className="h-[60px] px-4 flex justify-between items-center">
          <div className="w-full h-full flex items-center">
            <img
              src="https://cdna.artstation.com/p/assets/images/images/021/935/626/large/irina-nikiforova-purple.jpg?1573507084"
              alt="user"
              className="h-[26px] w-auto rounded-full object-cover transition group-hover:grayscale-[50%]"
            />
            <p className="font-medium ml-2 text-base">{username}</p>
          </div>
          <span className="flex gap-4">
            <span className="flex justify-center items-center gap-1">
              <svg width="10" height="15" viewBox="0 0 75 102" fill="none">
                <path
                  d="M3.70912 43.7159C11.2067 30.1874 18.4261 16.9488 25.7262 3.75497C28.0003 -0.499949 35.1524 -0.112667 38.9755 1.98101C43.4606 4.43725 45.4056 9.82417 43.0435 14.4836C39.054 22.3532 34.7602 30.0683 30.6173 37.8606C30.1101 38.8147 29.7439 39.8437 29.242 41C41.3672 41 53.1843 41.1106 64.9973 40.9397C69.0982 40.8804 72.6179 42.4178 73.7293 45.9134C74.7629 49.1646 75.0463 53.6736 73.557 56.5338C66.5937 69.9075 58.8839 82.8918 51.4819 96.0384C48.6345 101.096 42.5315 102.858 37.1878 100.058C32.357 97.528 30.4609 91.7608 33.1146 86.703C37.5742 78.2034 42.2446 69.8145 47.0321 61C35.052 61 23.6077 60.8632 12.1694 61.0679C7.6384 61.149 3.9801 60.0041 2.00343 55.8166C0 51.5 0.500143 48 3.70912 43.7159Z"
                  fill="white"
                />
              </svg>
              {likeCount}
            </span>
            <span className="flex justify-center items-center gap-1">
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                <path
                  d="M10.5 7.875C11.9497 7.875 13.125 9.05025 13.125 10.5C13.125 11.9497 11.9497 13.125 10.5 13.125C9.05025 13.125 7.875 11.9497 7.875 10.5C7.875 9.05025 9.05025 7.875 10.5 7.875Z"
                  fill="#CECECE"
                />
                <path
                  d="M20.132 11.2137C19.0467 12.892 17.6386 14.3177 16.0603 15.337C14.3143 16.4657 12.3866 17.0625 10.4859 17.0625C8.74191 17.0625 7.02705 16.5642 5.38888 15.5814C3.71832 14.5794 2.20484 13.1156 0.890291 11.2309C0.74189 11.0179 0.66016 10.7656 0.655486 10.506C0.650812 10.2465 0.723405 9.9914 0.864041 9.7732C1.94726 8.07803 3.34138 6.65027 4.89506 5.64498C6.64437 4.51172 8.52699 3.9375 10.4859 3.9375C12.4017 3.9375 14.3336 4.52936 16.0722 5.64867C17.6497 6.66463 19.0549 8.09566 20.1361 9.78797C20.2718 10.0011 20.3436 10.2487 20.3429 10.5014C20.3422 10.7541 20.269 11.0013 20.132 11.2137ZM10.4998 6.5625C9.72108 6.5625 8.9598 6.79343 8.31228 7.22609C7.66476 7.65875 7.16009 8.2737 6.86207 8.99318C6.56405 9.71267 6.48607 10.5044 6.638 11.2682C6.78993 12.032 7.16494 12.7336 7.71561 13.2842C8.26628 13.8349 8.96787 14.2099 9.73167 14.3618C10.4955 14.5138 11.2872 14.4358 12.0067 14.1378C12.7261 13.8398 13.3411 13.3351 13.7738 12.6876C14.2064 12.0401 14.4374 11.2788 14.4374 10.5C14.4374 9.18375 13.8826 7.9375 12.7481 6.80303C11.6136 5.66855 10.3674 5.0625 9.05118 5.0625C8.27245 5.0625 7.51117 5.29343 6.86365 5.72609C6.21613 6.15875 5.71146 6.7737 5.41343 7.49318C5.11541 8.21267 5.03743 9.0044 5.18936 9.7682C5.34129 10.532 5.7163 11.2336 6.26697 11.7842C6.81764 12.3349 7.51923 12.7099 8.28303 12.8618C9.04683 13.0138 9.83854 12.9358 10.558 12.6378C11.2775 12.3398 11.8924 11.8351 12.325 11.1876C12.7577 10.5401 12.9887 9.7788 12.9887 9.00003C12.9887 8.22126 12.7447 7.46441 12.2766 6.99632C11.8086 6.52824 11.0517 6.28429 10.273 6.28429C10.2633 6.28429 10.2536 6.28428 10.2439 6.28428L10.4998 6.5625Z"
                  fill="#CECECE"
                />
              </svg>
              000
            </span>
          </span>
        </div>
      </div>
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-end justify-center z-50 cursor-pointer"
          onClick={closeModal} // Close the modal on click outside
        >
          <div
            className="bg-[#081728] w-screen h-[90vh] rounded-xl overflow-y-auto cursor-default" // Add overflow-y-auto class for scrollable behavior
            onClick={(e) => e.stopPropagation()} // Prevent click event from bubbling to the outer div
          >
            <CardModel
              title={title}
              description={description}
              imageurl={imageUrl}
              username={username}
              tags={tags}
              liveLink={liveLink}
              sourceCode={sourceCode}
              userid={userid}
              craftid={craftid}
              likes={likes}
              likeCount={likeCount}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Card;
