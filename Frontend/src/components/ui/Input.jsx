export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`
        w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
        bg-white dark:bg-gray-800 text-gray-900 dark:text-white
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
        transition-colors duration-200
        placeholder-gray-400 dark:placeholder-gray-500
        ${className}
      `}
      {...props}
    />
  );
}