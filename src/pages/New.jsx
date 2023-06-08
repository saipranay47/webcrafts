import React from "react";
import { useUser } from "../hooks/user";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "../components/Container";
import CraftForm from "../components/CraftForm";

function New() {
  const { user } = useUser();
  const navigate = useNavigate();



  return (
    <div>
      <Container className="bg-[#10101D] text-white w-full h-full min-h-screen">
        {user ? (
          <CraftForm auth={user} />
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
      </Container>
    </div>
  );
}

export default New;
