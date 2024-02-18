import Box from "@mui/joy/Box";
import { Divider } from "@mui/joy";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
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

import SidebarLink from "./SidebarLink";

export default function Sidebar(): JSX.Element {
  return (
    <Box
      component="nav"
      className="Navigation"
      sx={[
        {
          p: 2,
          height: "100vh",
          width: "18%",
          position: "fixed",
          bgcolor: "background.surface",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      ]}
    >
      <h4 className="mb-2 p-2">COMPANY NAME</h4>
      <Divider />
      <List size="sm" sx={{ "--ListItem-radius": "8px", "--List-gap": "4px" }}>
        <ListItem nested>
          <ListSubheader
            sx={{ letterSpacing: "2px", fontWeight: "800", marginTop: "10px" }}
          >
            Configuration
          </ListSubheader>
          <List aria-labelledby="nav-list-browse">
            <SidebarLink
              Icon={WidgetsRoundedIcon}
              label="Items"
              link="/configuration/item"
            />
            <SidebarLink
              Icon={GroupsRoundedIcon}
              label="Suppliers"
              link="/configuration/supplier"
            />
            <SidebarLink
              Icon={WarehouseRoundedIcon}
              label="Warehouses"
              link="/configuration/warehouse"
            />
          </List>
        </ListItem>
        <ListItem nested sx={{ mt: 2 }}>
          <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
            Purchasing
          </ListSubheader>
          <List
            aria-labelledby="nav-list-tags"
            size="sm"
            sx={{
              "--ListItemDecorator-size": "32px",
            }}
          >
            <SidebarLink
              Icon={ShoppingCartIcon}
              label="Purchase Order"
              link="/purchasing/purchase-order"
            />
            <SidebarLink
              Icon={LocalShippingIcon}
              label="Supplier Delivery Receipt"
              link="/purchasing/delivery-receipt"
            />
            <SidebarLink
              Icon={InventoryRoundedIcon}
              label="Receiving Report"
              link="/purchasing/receiving-report"
            />
            <SidebarLink
              Icon={SwapHorizontalCircleRoundedIcon}
              label="Stock Transfer"
              link="/purchasing/stock-transfer"
            />
          </List>
        </ListItem>
        <ListItem nested sx={{ mt: 2 }}>
          <ListSubheader sx={{ letterSpacing: "2px", fontWeight: "800" }}>
            Sales
          </ListSubheader>
          <List
            aria-labelledby="nav-list-tags"
            size="sm"
            sx={{
              "--ListItemDecorator-size": "32px",
            }}
          >
            <SidebarLink
              Icon={ShoppingCartIcon}
              label="Customer Purchase Order"
              link="/sales/customer-purchase-order"
            />
            <SidebarLink
              Icon={MoveDownRoundedIcon}
              label="Allocation"
              link="/sales/allocation"
            />
            <SidebarLink
              Icon={MoveUpRoundedIcon}
              label="De-Allocation"
              link="/sales/deallocation"
            />
            <SidebarLink
              Icon={LocalShippingIcon}
              label="Delivery Planning"
              link="/sales/delivery-planning"
            />
            <SidebarLink
              Icon={AssignmentReturnRoundedIcon}
              label="Customer Return"
              link="/sales/customer-return"
            />
            <SidebarLink
              Icon={PaidRoundedIcon}
              label="A.R. Receipts"
              link="/sales/ar-receipts"
            />
          </List>
        </ListItem>
      </List>
    </Box>
  );
}
