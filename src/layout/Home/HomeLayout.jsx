import HomeTopBar from "./HomeTopBar";
import { Outlet } from "react-router-dom";

const HomeUILayout = () => {
  return (
    <div className=" min-h-screen flex flex-col">
      <HomeTopBar />
      <div className="flex-1 fade-in-up">
        <Outlet />
      </div>
    </div>
  );
};

export default HomeUILayout;
