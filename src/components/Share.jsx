import { Popover, Transition } from "@headlessui/react";
import { Fragment } from "react";
import share from "../images/share.svg";
import ShareComponent from "./ShareComponent";

const ShareButton = () => (
  <div className="h-[40px] p-[14px] bg-gray-200 rounded-full flex justify-center items-center cursor-pointer">
    <img src={share} className="opacity-60 h-full" alt="Share" />
  </div>
);

const Share = ({ id }) => (
  <Popover>
    {({ open }) => (
      <>
        <Popover.Button>
          <ShareButton />
        </Popover.Button>
        <Transition
          show={open}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <Popover.Panel
            static
            className="absolute z-10 w-64 max-w-sm px-4 mt-3 transform -translate-x-3/4 md:-translate-x-full left-1/2 sm:px-0"
          >
            <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white">
              <div className="p-4">
                <ShareComponent
                  url={`${import.meta.env.VITE_PUBLIC_BASE_URL}/craft/${id}`}
                  text="check out this amazing craft on webcrafts"
                />
              </div>
            </div>
          </Popover.Panel>
        </Transition>
      </>
    )}
  </Popover>
);

export default Share;
