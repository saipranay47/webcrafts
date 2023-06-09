import React from "react";

function Footer() {
  return (
    <div className="flex w-full justify-center items-center bg-gray-800 mt-24  ">
      <footer className="w-full flex flex-wrap items-center justify-between max-md:justify-center gap-2 py-4 max-w-7xl p-16 ">
        <div className="flex items-center gap-4">
          <a
            href="https://hashnode.com/hackathons/appwrite"
            target="_blank"
            className="underline"
          >
            2023 Appwrite Hackathon
          </a>
          <a
            href="https://github.com/saipranay47/webcrafts"
            target="_blank"
            className="text-gray-300"
          >
            Github repo
          </a>
        </div>

        <div className="flex items-center gap-4">
          <p>Powered by</p>
          <a href="https://appwrite.io/" target="_blank">
            <img
              src="/appwrite.svg"
              alt="Vercel logo-type"
              width={108}
              height={27}
            />
          </a>
          <a href="https://vercel.com/" target="_blank">
            <img
              src="/vercel.svg"
              alt="Vercel logo-type"
              width={88}
              height={20}
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
