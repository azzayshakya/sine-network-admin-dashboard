import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/authContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const HomeTopBar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [open, setOpen] = useState(false); // profile dropdown
  const [mobileMenu, setMobileMenu] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔒 Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔄 Close menus on route change
  useEffect(() => {
    setMobileMenu(false);
    setOpen(false);
  }, [location.pathname]);

  // 🚪 Logout with navigation
  const handleLogout = () => {
    logout();
    navigate("/home");
  };

  return (
    <div className="relative mx-4 mt-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 px-4 py-3 text-white shadow-lg md:mx-6 md:px-6 md:py-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => navigate("/home")}
          className="cursor-pointer text-xl font-semibold hover:text-yellow-300 md:text-2xl"
        >
          Company Logo
        </div>

        {/* Desktop Nav */}
        <div className="hidden items-center space-x-6 md:flex">
          <Link to="/home" className="hover:text-yellow-300">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/charts" className="hover:text-yellow-300">
                Charts
              </Link>
              <Link to="/tables" className="hover:text-yellow-300">
                Tables
              </Link>

              {/* Profile */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-cyan-600 shadow-md hover:scale-105"
                >
                  <span className="font-bold">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </button>

                {open && (
                  <div className="absolute right-0 z-20 mt-3 w-72 rounded-xl bg-white p-4 text-gray-800 shadow-xl">
                    <div className="mb-3 border-b pb-3">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-sm text-gray-500">@{user?.username}</p>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p>
                        <b>Email:</b> {user?.email}
                      </p>
                      <p>
                        <b>Role:</b> {user?.role}
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="mt-4 w-full rounded-lg bg-red-500 py-2 text-white hover:bg-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <Link to="/login" className="hover:text-yellow-300">
              Log In
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="rounded-lg bg-white/20 p-2 md:hidden"
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {mobileMenu && (
        <div className="mt-4 space-y-3 rounded-xl bg-white p-4 text-gray-800 shadow-lg md:hidden">
          <Link to="/home" className="block">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/charts" className="block">
                Charts
              </Link>
              <Link to="/tables" className="block">
                Tables
              </Link>

              {/* Mobile Profile */}
              <div className="mt-3 rounded-lg border p-3">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-gray-500">@{user?.username}</p>

                <div className="mt-2 text-sm">
                  <p>
                    <b>Email:</b> {user?.email}
                  </p>
                  <p>
                    <b>Role:</b> {user?.role}
                  </p>
                </div>

                <button
                  onClick={handleLogout}
                  className="mt-3 w-full rounded-lg bg-red-500 py-2 text-white"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="block">
              Log In
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default HomeTopBar;
