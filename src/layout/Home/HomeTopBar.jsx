import { Link } from 'react-router-dom';

const HomeTopBar = () => {
  return (
    <div className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white py-4 px-6 flex justify-between items-center shadow-lg rounded-lg mt-4 mx-6 transition-all ease-in-out duration-300">
      <div className="text-2xl font-semibold cursor-pointer hover:text-yellow-300 transition-all">Company Logo</div>
      <div className="space-x-6 hidden md:flex">
        <Link to="/home" className="hover:text-yellow-300 transition-all">Home</Link>
        <Link to="/home" className="hover:text-yellow-300 transition-all">About</Link>
        
      </div>
      <div className="md:hidden">
        <button className="text-white p-2 rounded-lg bg-gray-700 hover:bg-gray-800">☰</button>
      </div>
    </div>
  );
};

export default HomeTopBar;
