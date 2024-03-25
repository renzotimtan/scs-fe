import { type ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className="font-inter">
      <Sidebar />
      <main className="w-[82%] ml-[18%] py-8 px-20">{children}</main>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

export default Layout;
