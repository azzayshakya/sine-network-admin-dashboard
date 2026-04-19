import { Link } from "react-router-dom";

const HomeTopBar = () => {
  return (
    <div className="mx-6 mt-4 flex items-center justify-between rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4 text-white shadow-lg transition-all duration-300 ease-in-out">
      <div className="cursor-pointer text-2xl font-semibold transition-all hover:text-yellow-300">
        Company Logo
      </div>
      <div className="hidden space-x-6 md:flex">
        <Link to="/home" className="transition-all hover:text-yellow-300">
          Home
        </Link>
        <Link to="/login" className="transition-all hover:text-yellow-300">
          Log In
        </Link>
      </div>
      <div className="md:hidden">
        <button className="rounded-lg bg-gray-700 p-2 text-white hover:bg-gray-800">
          ☰
        </button>
      </div>
    </div>
  );
};

export default HomeTopBar;
