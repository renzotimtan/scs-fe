import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Card, Box, Table } from "@mui/joy";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";

import type {
  ViewWHModalProps,
  WarehouseItem,
  PaginatedWarehouseItems,
} from "../../interface";

const ViewWHModal = ({
  open,
  setOpen,
  row,
  type,
}: ViewWHModalProps): JSX.Element => {
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);

  useEffect(() => {
    if (type === "warehouse") {
      axiosInstance
        .get<PaginatedWarehouseItems>(
          `/api/warehouse_items?warehouse_id=${row?.id}`,
        )
        .then((response) => setWarehouseItems(response.data.items))
        .catch((error) => console.error("Error:", error));
    } else if (type === "item") {
      axiosInstance
        .get<PaginatedWarehouseItems>(`/api/warehouse_items?item_id=${row?.id}`)
        .then((response) => setWarehouseItems(response.data.items))
        .catch((error) => console.error("Error:", error));
    }
  }, [row]);

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        setOpen(false);
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Sheet
        variant="outlined"
        sx={{
          maxWidth: 1000,
          borderRadius: "md",
          p: 3,
          boxShadow: "lg",
        }}
      >
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <Box>
          <h3 className="mb-6">View Warehouse Stocks</h3>
          <Card className="w-[100%] mr-7">
            <Sheet
              sx={{
                "--TableCell-height": "40px",
                // the number is the amount of the header rows.
                "--TableHeader-height": "calc(1 * var(--TableCell-height))",
                "--Table-firstColumnWidth": "250px",
                "--Table-lastColumnWidth": "144px",
                // background needs to have transparency to show the scrolling shadows
                "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
                "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
                overflow: "auto",
                borderRadius: 8,
                background: (
                  theme,
                ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 0 50%,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),`,
                backgroundSize:
                  "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "local, local, scroll, scroll",
                backgroundPosition:
                  "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
                backgroundColor: "background.surface",
                maxHeight: "600px",
              }}
            >
              <Table
                className="h-5"
                sx={{
                  "& tr > *:first-child": {
                    position: "sticky",
                    left: 0,
                    boxShadow: "1px 0 var(--TableCell-borderColor)",
                    bgcolor: "background.surface",
                  },
                }}
                borderAxis="both"
              >
                <thead>
                  <tr>
                    <th style={{ width: "var(--Table-firstColumnWidth)" }}>
                      Warehouse Name
                    </th>
                    <th style={{ width: 100 }}>On Stock</th>
                    <th style={{ width: 100 }}>Allocated</th>
                    <th style={{ width: 100 }}>Purchased</th>
                    <th style={{ width: 100 }}>Sold</th>
                    <th style={{ width: 250 }}>Created By</th>
                    <th style={{ width: 250 }}>Date Created</th>
                    <th style={{ width: 250 }}>Modified By</th>
                    <th style={{ width: 250 }}>Date Modified</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseItems.map((warehouseItem) => (
                    <tr
                      key={`${warehouseItem.warehouse_id}-${warehouseItem.item_id}`}
                    >
                      <td>{warehouseItem.warehouse.name}</td>
                      <td>{warehouseItem.on_stock}</td>
                      <td>{warehouseItem.allocated}</td>
                      <td>{warehouseItem.purchased}</td>
                      <td>{warehouseItem.sold}</td>
                      <td>{warehouseItem.created_by}</td>
                      <td>{warehouseItem.date_created}</td>
                      <td>{warehouseItem.modified_by}</td>
                      <td>{warehouseItem.date_modified}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          </Card>
        </Box>
      </Sheet>
    </Modal>
  );
};

export default ViewWHModal;
