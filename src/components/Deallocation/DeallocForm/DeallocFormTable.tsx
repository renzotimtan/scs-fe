import { Sheet, Select, Option, Autocomplete, Input, Button } from "@mui/joy";
import Table from "@mui/joy/Table";
import { useState, useEffect } from "react";
import type { Item, WarehouseItem, Warehouse } from "../../../interface";
import { DeallocFormDetailsProps, DeallocFormTableProps } from "../interface";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";
import { convertToQueryParams } from "../../../helper";

const DeallocFormTable = ({
  selectedRow,
  selectedAlloc,
  allocItems,
  setAllocItems,
  openCreate,
  warehouses,
}: DeallocFormTableProps): JSX.Element => {
  const isEditDisabled =
    selectedRow !== undefined && selectedRow?.status !== "unposted";

  return (
    <Sheet
      sx={{
        "--TableCell-height": "40px",
        // the number is the amount of the header rows.
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "150px",
        "--Table-lastColumnWidth": "86px",
        // background needs to have transparency to show the scrolling shadows
        "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
        "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
        overflow: "auto",
        borderRadius: 8,
        marginTop: 3,
        background: (
          theme,
        ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
              linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
              radial-gradient(
                farthest-side at 0 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              ),
                0 100%`,
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
            <th
              style={{
                width: "var(--Table-firstColumnWidth)",
              }}
            >
              Alloc No.
            </th>
            <th style={{ width: 150 }}>CPO No.</th>
            <th style={{ width: 300 }}>Stock Code</th>
            <th style={{ width: 300 }}>Stock Description</th>
            <th style={{ width: 200 }}>Warehouse 1</th>
            <th style={{ width: 150 }}>Whse 1 Qty.</th>
            <th style={{ width: 200 }}>Warehouse 2</th>
            <th style={{ width: 150 }}>Whse 2 Qty.</th>
            <th style={{ width: 200 }}>Warehouse 3</th>
            <th style={{ width: 150 }}>Whse 3 Qty.</th>
          </tr>
        </thead>
        <tbody>
          {allocItems.map((item) => (
            <tr
              key={`${item.id}-${item.customer_purchase_order_id}-${item.stock_code}`}
            >
              <td
                style={{
                  width: "var(--Table-firstColumnWidth)",
                  zIndex: 10,
                }}
              >
                {item.id}
              </td>
              <td>{item.customer_purchase_order_id}</td>
              <td>{item.stock_code}</td>
              <td>{item.stock_description}</td>
              <td>
                <Autocomplete
                  options={warehouses.items.filter((warehouse) => warehouse.id)}
                  getOptionLabel={(option) => option.name}
                  value={item.warehouse_1}
                  onChange={(event, newValue) => {
                    setAllocItems((prevAllocItems) =>
                      prevAllocItems.map(
                        (allocItem) =>
                          allocItem.id === item.id &&
                          allocItem.customer_purchase_order_id ===
                            item.customer_purchase_order_id &&
                          allocItem.stock_code === item.stock_code
                            ? { ...allocItem, warehouse_1: newValue } // Update the matching item
                            : allocItem, // Keep other items unchanged
                      ),
                    );
                  }}
                  size="sm"
                  className="w-[100%]"
                  placeholder="Select Warehouse"
                  disabled={isEditDisabled}
                />
              </td>
              <td style={{ width: 150 }}>
                <Input
                  type="number"
                  value={item.warehouse_1_qty}
                  onChange={(e) => {
                    setAllocItems((prevAllocItems) =>
                      prevAllocItems.map((allocItem) =>
                        allocItem.id === item.id &&
                        allocItem.customer_purchase_order_id ===
                          item.customer_purchase_order_id &&
                        allocItem.stock_code === item.stock_code
                          ? { ...allocItem, warehouse_1_qty: e.target.value }
                          : allocItem,
                      ),
                    );
                  }}
                  slotProps={{
                    input: {
                      min: 0,
                    },
                  }}
                  placeholder="0"
                  disabled={isEditDisabled}
                />
              </td>
              <td style={{ width: 200 }}>
                <Autocomplete
                  options={warehouses.items.filter((warehouse) => warehouse.id)}
                  getOptionLabel={(option) => option.name}
                  value={item.warehouse_2}
                  onChange={(event, newValue) => {
                    setAllocItems((prevAllocItems) =>
                      prevAllocItems.map(
                        (allocItem) =>
                          allocItem.id === item.id &&
                          allocItem.customer_purchase_order_id ===
                            item.customer_purchase_order_id &&
                          allocItem.stock_code === item.stock_code
                            ? { ...allocItem, warehouse_2: newValue } // Update the matching item
                            : allocItem, // Keep other items unchanged
                      ),
                    );
                  }}
                  size="sm"
                  className="w-[100%]"
                  placeholder="Select Warehouse"
                  disabled={isEditDisabled}
                />
              </td>
              <td style={{ width: 150 }}>
                <Input
                  type="number"
                  value={item.warehouse_2_qty}
                  onChange={(e) => {
                    setAllocItems((prevAllocItems) =>
                      prevAllocItems.map((allocItem) =>
                        allocItem.id === item.id &&
                        allocItem.customer_purchase_order_id ===
                          item.customer_purchase_order_id &&
                        allocItem.stock_code === item.stock_code
                          ? { ...allocItem, warehouse_2_qty: e.target.value }
                          : allocItem,
                      ),
                    );
                  }}
                  slotProps={{
                    input: {
                      min: 0,
                    },
                  }}
                  placeholder="0"
                  disabled={isEditDisabled}
                />
              </td>
              <td style={{ width: 200 }}>
                <Autocomplete
                  options={warehouses.items.filter((warehouse) => warehouse.id)}
                  getOptionLabel={(option) => option.name}
                  value={item.warehouse_3}
                  onChange={(event, newValue) => {
                    setAllocItems((prevAllocItems) =>
                      prevAllocItems.map(
                        (allocItem) =>
                          allocItem.id === item.id &&
                          allocItem.customer_purchase_order_id ===
                            item.customer_purchase_order_id &&
                          allocItem.stock_code === item.stock_code
                            ? { ...allocItem, warehouse_3: newValue } // Update the matching item
                            : allocItem, // Keep other items unchanged
                      ),
                    );
                  }}
                  size="sm"
                  className="w-[100%]"
                  placeholder="Select Warehouse"
                  disabled={isEditDisabled}
                />
              </td>
              <td style={{ width: 150 }}>
                <Input
                  type="number"
                  value={item.warehouse_3_qty}
                  onChange={(e) => {
                    setAllocItems((prevAllocItems) =>
                      prevAllocItems.map((allocItem) =>
                        allocItem.id === item.id &&
                        allocItem.customer_purchase_order_id ===
                          item.customer_purchase_order_id &&
                        allocItem.stock_code === item.stock_code
                          ? { ...allocItem, warehouse_3_qty: e.target.value }
                          : allocItem,
                      ),
                    );
                  }}
                  slotProps={{
                    input: {
                      min: 0,
                    },
                  }}
                  placeholder="0"
                  disabled={isEditDisabled}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default DeallocFormTable;
