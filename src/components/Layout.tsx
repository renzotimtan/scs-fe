import { type ReactNode } from "react";
import Sidebar from "./Sidebar/Sidebar";

const Layout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className="font-poppins flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
