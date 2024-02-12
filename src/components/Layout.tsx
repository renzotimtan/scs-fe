import { type ReactNode } from "react";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className="font-inter">
      <Sidebar />
      <main className="w-[84%] ml-[16%]">{children}</main>
    </div>
  );
};

export default Layout;
