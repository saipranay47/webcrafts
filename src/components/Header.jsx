import { Fragment, useState } from "react";
import React from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { Button } from "./Button";
import { ButtonLink } from "./Button";
import { Container } from "./Container.jsx";
import { Logo } from "./Logo";
import { Link } from "react-router-dom";
import { useUser } from "../hooks/user";
import avatar from "../images/avatar.svg";
import { useNavigate } from "react-router-dom";

function ProfileMenu() {
  const [SignedIn, setSignedIn] = useState(false);
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
          {SignedIn ? (
            <div className="relative ml-6 hidden md:block">
              <Popover.Button className="flex items-center group focus:outline-none relative">
                <div className="h-[36px] w-auto">
                  <img
                    src={avatar}
                    alt=""
                    className="h-full w-auto rounded-full"
                  />
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
                          <div className="flex items-center space-x-4">
                            <img
                              src={avatar}
                              alt=""
                              className="h-10 w-10 rounded-full"
                            />
                            {user && (
                              <span className="text-xl">{user.name}</span>
                            )}
                          </div>
                        </Link>
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
                  <Link to="#Inspiration">
                    <span className="block w-full" onClick={() => close()}>
                      Inspiration
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="#Resources">
                    <span className="block w-full" onClick={() => close()}>
                      Resources
                    </span>
                  </Link>
                </li>
                <li>
                  <Link to="#ProjectIdeas">
                    <span className="block w-full" onClick={() => close()}>
                      Project Ideas
                    </span>
                  </Link>
                </li>
                {signedIn ? (
                  <li className="border-t border-slate-300/40 pt-4">
                    <Link to="/user">
                      <div className="h-[32px] w-auto flex gap-3 items-center">
                        <img
                          src={avatar}
                          alt=""
                          className="h-full w-auto rounded-full"
                        />
                        {user && (
                          <span className="block w-full text-xl">
                            {user.name}
                          </span>
                        )}
                      </div>
                    </Link>
                  </li>
                ) : (
                  <li className="border-t border-slate-300/40 pt-4">
                    <Link to="/sign-in">
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
    <header className="py-8 bg-zinc-900 text-white">
      <Container>
        <nav className="relative z-50 text-sm flex justify-between">
          <ul className="flex items-center">
            <li>
              <Link to="/">
                <span>
                  <span className="sr-only">Home</span>
                  <Logo className="h-10 w-auto" />
                </span>
              </Link>
            </li>
            <li className="ml-12 hidden md:block">
              <Link to="#Inspiration">
                <span className=" text-slate-300 hover:text-white hover:underline decoration-wavy text-base">
                  Inspiration
                </span>
              </Link>
            </li>
            <li className="ml-6 hidden md:block">
              <Link to="#Resources">
                <span className=" text-slate-300 hover:text-white hover:underline decoration-wavy text-base">
                  Resources
                </span>
              </Link>
            </li>
            <li className="ml-6 hidden md:block">
              <Link to="#Project Ideas">
                <span className=" text-slate-300 hover:text-white hover:underline decoration-wavy text-base">
                  Project Ideas
                </span>
              </Link>
            </li>
          </ul>
          <ul className="flex items-center">
            <li className="ml-auto md:ml-8">
              <ButtonLink href="/new" color="blue">
                <span>Share work</span>
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
