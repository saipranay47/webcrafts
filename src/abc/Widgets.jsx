import React, { useState, useEffect } from "react";
import GitHubCalendar from "react-github-calendar";
import github from "../images/github.svg";
import hashnode from "../images/hashnode.png";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { useUser } from "../hooks/user";
import { Link } from "react-router-dom";

function Widgets({ auth }) {
  const { user } = useUser();
  const [placeholder, setPlaceholder] = useState(false);
  const selectLastHalfYear = (contributions) => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const shownMonths = 3;

    return contributions.filter((activity) => {
      const date = new Date(activity.date);
      const monthOfDay = date.getMonth();

      return (
        date.getFullYear() === currentYear &&
        monthOfDay > currentMonth - shownMonths &&
        monthOfDay <= currentMonth
      );
    });
  };

  const [og, setOg] = useState(null);
  const hashnodeLink = "https://saipranay47.hashnode.dev/";
  const getOG = async (url) => {
    try {
      const response = await fetch(
        `https://jsonlink.io/api/extract?url=${url}`
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  useEffect(() => {
    
    if(auth.prefs.github || auth.prefs.hashnode){
      setPlaceholder(false);
    }else{
      if(user?.$id === auth.$id)
      setPlaceholder(true);
    }

    getOG(hashnodeLink).then((data) => {
      setOg(data);
    });
  }, []);

  return (
    <div className="lg:ml-20 my-16  flex justify-center items-center gap-10 w-full max-lg:flex-wrap ">
      {placeholder && (
        <Link
          to="/profileupdate"
          className=" flex-col gap-2 mt-5 h-[200px] w-full sm:max-w-md border-dashed border-2 border-gray-500  p-6 flex flex-wrap-reverse  justify-center items-center rounded-xl  cursor-pointer bg-[#fff0] hover:bg-[#ffffff1c] "
        >
          <PlusCircleIcon className="w-10 fill-gray-100 opacity-70" />
          <p className="text-gray-100 opacity-70">
            add github and hashnode widgets
          </p>
        </Link>
      )}

      {auth.prefs.github && (
        <a
          href={`https://github.com/${auth.prefs.github}`}
          target="_blank"
          className="md:h-[200px] w-full sm:max-w-md bg-white  p-6 flex flex-wrap-reverse  justify-between items-center rounded-xl shadow-sm hover:shadow-md border-gray-300 border-[1px] cursor-pointer hover:opacity-90"
        >
          <div className="flex flex-col justify-between items-start md:h-full max-md:mt-10">
            <img
              src={github}
              alt=""
              className="h-[40px] w-auto rounded-lg shadow-md"
            />
            <p className=" text-lg font-semibold text-black max-md:my-2">
              {auth.prefs.github}
            </p>
            <p className=" text-sm text-gray-500 max-w-[150px] md:truncate mb-2">
              https://github.com/{auth.prefs.github}
            </p>
            <button className="bg-[#eeeeeef3] text-black rounded-md py-[4px] px-[20px] font-medium shadow-sm hover:shadow-md border-gray-300 border-[1px]">
              Follow
            </button>
          </div>

          <GitHubCalendar
            username={auth.prefs.github}
            hideColorLegend
            hideTotalCount
            transformData={selectLastHalfYear}
            colorScheme="light"
            hideMonthLabels
          />
        </a>
      )}
      {auth.prefs.hashnode && og && (
        <a
          href={og.url}
          target="_blank"
          className="flex-wrap-reverse md:h-[200px] sm:max-w-md w-full bg-white  p-6 flex  justify-between items-center rounded-xl shadow-sm hover:shadow-md border-gray-300 border-[1px] cursor-pointer hover:opacity-90"
        >
          <div className="flex flex-col justify-between items-start md:h-full">
            <img
              src={hashnode}
              alt=""
              className="h-[40px] w-auto rounded-lg mb-2 p-1 shadow-md"
            />
            <p className=" text-lg font-semibold text-black ">{og.title}</p>
            <p className=" text-sm text-gray-500 max-w-[150px] md:truncate mb-2">
              {og.url}
            </p>
            <button className="bg-[#eeeeeef3] text-black rounded-md py-[4px] px-[20px] font-medium shadow-sm hover:shadow-md border-gray-300 border-[1px]">
              Follow
            </button>
          </div>
          <img
            src={og.images[0]}
            alt=""
            className="md:h-full max-md:w-full object-cover rounded-xl aspect-1/4 max-md:mb-8"
          />
        </a>
      )}
    </div>
  );
}

export default Widgets;
