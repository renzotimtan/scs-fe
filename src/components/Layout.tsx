import { type ReactNode } from "react";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className="font-inter">
      <Sidebar />
      <main className="w-[82%] ml-[18%]">{children}</main>
    </div>
  );
};

export default Layout;
