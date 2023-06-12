import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

// Example fake comments
const fakeComments = [
  { id: 1, name: "John Doe", comment: "Great work!" },
  { id: 2, name: "Jane Smith", comment: "Love it!" },
  { id: 3, name: "Mike Johnson", comment: "Awesome job!" },
];

function CommentComponent() {
  const [comments] = useState(fakeComments);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className={`h-[40px] p-[13px] bg-gray-200 fill-gray-600 rounded-full flex justify-center items-center cursor-pointer ${
          open ? "bg-blue-500 text-white" : ""
        }`}
        onClick={() => setOpen(!open)}
      >
        <ChatBubbleLeftRightIcon
          className="h-full opacity-60 fill-black"
          aria-hidden="true"
        />
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed z-50 inset-0 overflow-y-auto"
          open={open}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-zinc-900 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="p-4">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Comments
                  </h3>
                  <div className="mt-2">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex items-start py-2">
                        <div className="flex-shrink-0">
                          <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full">
                            <span className="text-gray-500">
                              {comment.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {comment.name}
                          </p>
                          <p className="mt-1 text-sm text-gray-700">
                            {comment.comment}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}

export default CommentComponent;
