import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import BottomNav from "../components/BottomNav";
import { Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="flex-1 lg:overflow-y-scroll">
        <Toaster />
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
};

export default Layout;
