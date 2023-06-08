import React, { useState, useEffect } from "react";
import { useUser } from "../hooks/user";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import ProfileEditable from "../components/ProfileTop";
import UserCrafts from "../abc/UserCrafts";

function Profile() {
  const { user } = useUser();
  const [userid, setUserid] = useState(null);

  useEffect(() => {
    if (user) {
      setUserid(user.$id);
    }
  }, [user]);

  return (
    <div>
      <Header />
      <div className="bg-[#10101D] text-white w-full h-full min-h-screen">
        {user ? (
          <div>
            <ProfileEditable auth={user} />
            {/* Render userCrafts here */}
            <UserCrafts userid={userid} />
          </div>
        ) : (
          <div className="w-full h-full min-h-screen flex justify-center items-center">
            <span>
              {" "}
              <Link
                to="/login"
                className="underline font-semibold text-sky-500"
              >
                Login
              </Link>{" "}
              to share your work
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
