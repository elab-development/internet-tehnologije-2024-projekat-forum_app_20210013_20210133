import { useSearch } from "../hooks/useSearch";

const GlobalSearch = () => {
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <div className=" sm:w-4/5 w-full mb-4">
      <input
        type="text"
        placeholder="Search Questions by Title or Body Content..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
      />
    </div>
  );
};

export default GlobalSearch;
