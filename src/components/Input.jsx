export function Input({ id, label, type = "text", ...props }) {
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="mb-3 block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        {...props}
        className="block w-full appearance-none rounded-md border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm border-2"
      />
    </div>
  );
}