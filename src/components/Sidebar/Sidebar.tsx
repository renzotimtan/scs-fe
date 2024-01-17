import SidebarLink from "./SidebarLink";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import WidgetsRoundedIcon from "@mui/icons-material/WidgetsRounded";
import MoveUpRoundedIcon from "@mui/icons-material/MoveUpRounded";
import MoveDownRoundedIcon from "@mui/icons-material/MoveDownRounded";
import AssignmentReturnRoundedIcon from "@mui/icons-material/AssignmentReturnRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryRoundedIcon from "@mui/icons-material/InventoryRounded";
import SwapHorizontalCircleRoundedIcon from "@mui/icons-material/SwapHorizontalCircleRounded";

const Sidebar = (): JSX.Element => {
  return (
    <nav className="bg-sidebar-dark h-screen w-[310px]">
      <div className="px-5">
        <h3 className="mb-5 pt-8 text-sidebar-light">Company Name</h3>
        <hr className="text-sidebar-light mb-8" />

        <div className="mb-6">
          <h4 className="text-sidebar-light mb-3">Configuration</h4>
          <div>
            <SidebarLink Icon={WidgetsRoundedIcon} label="Items" />
            <SidebarLink Icon={GroupsRoundedIcon} label="Suppliers" />
            <SidebarLink Icon={WarehouseRoundedIcon} label="Warehouses" />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sidebar-light mb-3">Purchasing</h4>
          <div>
            <SidebarLink Icon={ShoppingCartIcon} label="Purchase Order" />
            <SidebarLink
              Icon={LocalShippingIcon}
              label="Supplier Delivery Receipt"
            />
            <SidebarLink Icon={InventoryRoundedIcon} label="Receiving Report" />
            <SidebarLink
              Icon={SwapHorizontalCircleRoundedIcon}
              label="Stock Transfer"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-sidebar-light mb-3">Sales</h4>
          <div>
            <SidebarLink
              Icon={ShoppingCartIcon}
              label="Customer Purchase Order"
            />
            <SidebarLink Icon={MoveDownRoundedIcon} label="Allocation" />
            <SidebarLink Icon={MoveUpRoundedIcon} label="De-Allocation" />
            <SidebarLink Icon={LocalShippingIcon} label="Delivery Planning" />
            <SidebarLink
              Icon={AssignmentReturnRoundedIcon}
              label="Customer Return"
            />
            <SidebarLink Icon={PaidRoundedIcon} label="A.R. Receipts" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
