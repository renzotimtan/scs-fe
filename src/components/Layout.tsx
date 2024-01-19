import { type ReactNode } from "react";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className="font-inter flex">
      <Sidebar />
      <main className="w-[84%]">{children}</main>
    </div>
  );
};

export default Layout;
