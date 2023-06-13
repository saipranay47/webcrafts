import { Fragment, useState } from "react";
import React from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Button } from "./Button";
import { ButtonLink } from "./Button";
import { Container } from "./Container.jsx";
import logoIcon from "../images/logoIcon.svg";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/user";
import avatar from "../images/avatar.svg";
import { useNavigate } from "react-router-dom";
import Search from "./Search";
import { NavLink } from "react-router-dom";

function ProfileMenu() {
  const [SignedIn, setSignedIn] = useState(false);
  const { user } = useUser();

  React.useEffect(() => {
    if (user) {
      setSignedIn(true);
      console.log(user);
    } else {
      setSignedIn(false);
    }
  }, [user]);

  const navigate = useNavigate();
  const { logout } = useUser();

  const handleLogout = async () => {
    await logout();
    alert("logout");
    navigate("/login");
  };

  return (
    <Popover>
      {({ open, close }) => (
        <>
          {SignedIn ? (
            <div className="relative ml-6 hidden md:block">
              <Popover.Button className="flex items-center group focus:outline-none relative">
                <div className="h-[36px] w-[36px]">
                  {user.prefs.photo ? (
                    <img
                      src={user.prefs.photo}
                      alt=""
                      className="h-full w-auto rounded-full"
                    />
                  ) : (
                    <svg
                      className=" text-gray-300 w-full h-full bg-gray-500 rounded-full object-cover"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </div>
              </Popover.Button>
              <Transition.Root>
                <Transition.Child
                  as={Fragment}
                  enter="duration-150 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="duration-100 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-[300px] -translate-x-3/4 transform px-4 sm:px-0">
                    <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                      <div className="relative grid gap-8 bg-[#000] p-7 w-full">
                        <Link to="/profile">
                          {user && (
                            <div className="flex items-center space-x-4">
                              {user.prefs.photo ? (
                                <img
                                  src={user.prefs.photo}
                                  alt=""
                                  className="h-10 w-10 rounded-full"
                                />
                              ) : (
                                <svg
                                  className=" text-gray-300 w-10 h-10 bg-gray-500 rounded-full object-cover"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              )}
                              <span className="text-xl">{user.name}</span>
                            </div>
                          )}
                        </Link>

                        <ButtonLink
                          color="white"
                          href="/profileupdate"
                          className="w-full"
                        >
                          <span>Edit Profile</span>
                        </ButtonLink>
                        <Button color="white" onClick={handleLogout}>
                          <span>Sign out</span>
                        </Button>
                      </div>
                    </div>
                  </Popover.Panel>
                </Transition.Child>
              </Transition.Root>
            </div>
          ) : (
            <div className="ml-6 hidden md:block">
              <Link to="/sign-in">
                <span className="text-slate-300 hover:text-white hover:underline decoration-wavy text-base">
                  Sign in
                </span>
              </Link>
            </div>
          )}
        </>
      )}
    </Popover>
  );
}

function MobileNavigation() {
  const [signedIn, setSignedIn] = useState(false);
  const { user } = useUser();

  React.useEffect(() => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [user]);

  const { logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    alert("logout");
    navigate("/login");
  };

  return (
    <Popover>
      {({ open, close }) => (
        <>
          <Popover.Button className="relative z-10 flex h-8 w-8 items-center justify-center [&:not(:focus-visible)]:focus:outline-none">
            <span className="sr-only">Toggle Navigation</span>
            <svg
              aria-hidden="true"
              className="h-3.5 w-3.5 overflow-visible stroke-gray-200"
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path
                d="M0 1H14M0 7H14M0 13H14"
                className={clsx("origin-center transition", {
                  "scale-90 opacity-0": open,
                })}
              />
              <path
                d="M2 2L12 12M12 2L2 12"
                className={clsx("origin-center transition", {
                  "scale-90 opacity-0": !open,
                })}
              />
            </svg>
          </Popover.Button>
          <Transition.Root>
            <Transition.Child
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-150 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Popover.Overlay className="fixed inset-0 bg-slate-300/50" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="duration-150 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-100 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Popover.Panel
                as="ul"
                className="absolute inset-x-0 top-full mt-4 origin-top space-y-4 rounded-2xl bg-[#10101D] p-6 text-lg tracking-tight text-slate-100 shadow-xl ring-1 ring-slate-900/5"
              >
                <li>
                  <NavLink to="/craftsshowcase">
                    <span className="block w-full" onClick={() => close()}>
                      Crafts Showcase
                    </span>
                  </NavLink>
                </li>
                {/* <li>
                  <Link to="#Resources">
                    <span className="block w-full" onClick={() => close()}>
                      Resources
                    </span>
                  </Link>
                </li> */}
                <li>
                  {/* <NavLink to="/crafteddevs">
                    <span className="block w-full" onClick={() => close()}>
                      Crafted Devs
                    </span>
                  </NavLink> */}
                </li>
                {signedIn ? (
                  <li className="border-t border-slate-300/40 pt-4">
                    <Link to="/profile">
                      <div className="h-[32px] w-auto flex gap-3 items-center mb-2">
                        {user && (
                          <div className="flex items-center space-x-4">
                            {user.prefs.photo ? (
                              <img
                                src={user.prefs.photo}
                                alt=""
                                className="h-10 w-10 rounded-full"
                              />
                            ) : (
                              <svg
                                className=" text-gray-300 w-10 h-10 bg-gray-500 rounded-full object-cover"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                              </svg>
                            )}
                            <span className="text-xl">{user.name}</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    <ButtonLink
                      color="white"
                      href="/profileupdate"
                      className="w-full mt-2"
                    >
                      <span>Edit Profile</span>
                    </ButtonLink>

                    <Button
                      color="white"
                      className="mt-2 w-full"
                      onClick={handleLogout}
                    >
                      <span>Sign out</span>
                    </Button>
                  </li>
                ) : (
                  <li className="border-t border-slate-300/40 pt-4">
                    <Link to="/login">
                      <span className="block w-full">Sign in</span>
                    </Link>
                  </li>
                )}
              </Popover.Panel>
            </Transition.Child>
          </Transition.Root>
        </>
      )}
    </Popover>
  );
}

export function Header() {
  const [signedIn, setSignedIn] = useState(false);
  const { user } = useUser();

  React.useEffect(() => {
    if (user) {
      setSignedIn(true);
    } else {
      setSignedIn(false);
    }
  }, [user]);

  return (
    <header className="py-6 bg-zinc-900 text-white">
      <Container className="max-w-none">
        <nav className="relative z-50 text-sm flex justify-between">
          <ul className="flex items-center">
            <li>
              <Link to="/">
                <span>
                  <span className="sr-only">Home</span>
                  <img src={logoIcon} alt="" className="min-w-[50px]" />
                </span>
              </Link>
            </li>
            <li className=" ml-7 hidden md:block">
              <NavLink
                to="/craftsshowcase"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "underline decoration-wavy"
                    : "hover:underline decoration-wavy"
                }
              >
                <span className=" text-slate-300 hover:text-white text-base">
                  Crafts Showcase
                </span>
              </NavLink>
            </li>
            {/* <li className="ml-6 hidden md:block">
              <Link to="#Resources">
                <span className=" text-slate-300 hover:text-white hover:underline decoration-wavy text-base">
                  Resources
                </span>
              </Link>
            </li> */}
            <li className="ml-6 hidden md:block">
              {/* <NavLink
                to="/crafteddevs"
                className={({ isActive, isPending }) =>
                  isPending
                    ? "pending"
                    : isActive
                    ? "underline decoration-wavy"
                    : "hover:underline decoration-wavy"
                }
              >
                <span className=" text-slate-300 hover:text-white text-base whitespace-nowrap">
                  Crafted Devs
                </span>
              </NavLink> */}
            </li>
          </ul>
          <Search
            className="hidden sm:flex justify-center flex-1 "
            formw = ""
            innerclass=" -translate-x-[30%] md:translate-x-0 max-w-[250%] block absolute z-20 top-[0.7rem] rounded-lg w-[28rem] md:max-w-full bg-white dark:bg-zinc-900 shadow-[0px_1px_3px_0px_rgba(15,23,42,0.1),0_35px_60px_-15px_rgba(15,23,42,0.3)] overflow-hidden transition-all ease-out duration-150"
          />
          <ul className="flex items-center justify-center gap-1">
            <li className="hidden max-sm:block">
              <ButtonLink
                color="blue"
                className="max-md:text-[12px] px-[7px] py-[6px] mr-10px"
                href="/searchpage"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                  className="w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </ButtonLink>
            </li>
            <br />
            <li className="ml-auto md:ml-8">
              <ButtonLink
                href="/new"
                color="blue"
                className="max-md:text-[12px]"
              >
                <span className="whitespace-nowrap">Share work</span>
              </ButtonLink>
            </li>
            {signedIn ? (
              <li className="ml-6 hidden md:block">
                <ProfileMenu />
              </li>
            ) : (
              <li className="ml-6 hidden md:block">
                <Link to="/login">
                  <span className=" text-slate-300 hover:text-white hover:underline decoration-wavy text-base">
                    Sign in
                  </span>
                </Link>
              </li>
            )}
            <li className="ml-5 -mr-1 md:hidden">
              <MobileNavigation />
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
