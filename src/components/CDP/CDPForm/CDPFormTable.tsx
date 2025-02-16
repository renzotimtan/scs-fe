import { Sheet, Input } from "@mui/joy";
import Table from "@mui/joy/Table";

import type { CDPFormTableProps } from "../interface";
import { useEffect, useState } from "react";
import type { POItems, PurchaseOrder } from "../../../interface";

const CDPFormTable = ({
  selectedRow,
  formattedAllocs,
  setFormattedAllocs,
  selectedAllocs,
  setSelectedAllocs,
  totalNet,
  totalGross,
  totalItems,
  setTotalItems,
  openEdit,
  isEditDisabled,
}: CDPFormTableProps): JSX.Element => {
  const status = selectedRow?.status;

  const calculateTotalGross = (item: any): number => {
    const price = item?.price ?? 0;
    const warehouseQuantities = [
      item.warehouse_1_qty,
      item.warehouse_2_qty,
      item.warehouse_3_qty,
    ];

    const totalQuantity = warehouseQuantities.reduce(
      (sum, qty) =>
        sum + (qty !== undefined && !isNaN(Number(qty)) ? Number(qty) : 0),
      0,
    );

    return totalQuantity * price;
  };

  const handleQuantityChange = (
    itemId: number,
    stockCode: string,
    warehouseKey: "warehouse_1_qty" | "warehouse_2_qty" | "warehouse_3_qty",
    value: string,
  ): void => {
    setFormattedAllocs((prevAllocItems) =>
      prevAllocItems.map((allocItem) => {
        if (allocItem.id === itemId && allocItem.stock_code === stockCode) {
          const whse1qty =
            warehouseKey === "warehouse_1_qty"
              ? value
              : allocItem.warehouse_1_qty;

          const whse2qty =
            warehouseKey === "warehouse_2_qty"
              ? value
              : allocItem.warehouse_2_qty;

          const whse3qty =
            warehouseKey === "warehouse_3_qty"
              ? value
              : allocItem.warehouse_3_qty;

          // Calculate new gross amount
          const warehouseQuantities = [whse1qty, whse2qty, whse3qty];

          const totalQuantity = warehouseQuantities.reduce(
            (sum, qty) =>
              sum +
              (qty !== undefined && !isNaN(Number(qty)) ? Number(qty) : 0),
            0,
          );
          const newGrossAmount = totalQuantity * (allocItem.price ?? 0);

          return {
            ...allocItem,
            [warehouseKey]: value, // Update changed warehouse quantity
            gross_amount: newGrossAmount,
            net_amount: newGrossAmount,
          };
        }
        return allocItem;
      }),
    );
  };

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
            <th style={{ width: 200 }}>Stock Code</th>
            <th style={{ width: 300 }}>Name</th>
            <th style={{ width: 150 }}>Price</th>
            <th style={{ width: 150 }}>Gross Amount</th>
            <th style={{ width: 150 }}>NET Amount</th>

            <th style={{ width: 200 }}>Whse 1 Alloc Qty.</th>
            <th style={{ width: 200 }}>Whse 1</th>
            <th style={{ width: 200 }}>Whse 1 DR Plan Qty. </th>

            <th style={{ width: 200 }}>Whse 2 Alloc Qty.</th>
            <th style={{ width: 200 }}>Whse 2</th>
            <th style={{ width: 200 }}>Whse 2 DR Plan Qty. </th>

            <th style={{ width: 200 }}>Whse 3 Alloc Qty.</th>
            <th style={{ width: 200 }}>Whse 3</th>
            <th style={{ width: 200 }}>Whse 3 DR Plan Qty. </th>
          </tr>
        </thead>
        <tbody>
          {formattedAllocs.map((item, index) => {
            const key = `${item.id}-${item.stock_code}`;
            const price = item?.price ?? 0;
            const totalGross = calculateTotalGross(item);

            return (
              <tr key={key}>
                <td style={{ zIndex: 1 }}>{item.id}</td>
                <td>{item?.stock_code}</td>
                <td>{item?.name}</td>
                <td>{price}</td>
                <td>{totalGross.toFixed(4)}</td>
                <td>{item.net_amount}</td>
                <td>{item.alloc_qty_1}</td>
                <td>{item.warehouse_1}</td>
                <td>
                  <Input
                    type="number"
                    value={item.warehouse_1_qty}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        item.stock_code,
                        "warehouse_1_qty",
                        e.target.value,
                      )
                    }
                    slotProps={{
                      input: {
                        min: 0,
                        max: item.alloc_qty_1 ?? 0,
                      },
                    }}
                    placeholder="0"
                    disabled={isEditDisabled || item.warehouse_1 === "N/A"}
                  />
                </td>

                <td>{item.alloc_qty_2}</td>
                <td>{item.warehouse_2}</td>
                <td>
                  <Input
                    type="number"
                    value={item.warehouse_2_qty}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        item.stock_code,
                        "warehouse_2_qty",
                        e.target.value,
                      )
                    }
                    slotProps={{
                      input: {
                        min: 0,
                        max: item.alloc_qty_2 ?? 0,
                      },
                    }}
                    placeholder="0"
                    disabled={isEditDisabled || item.warehouse_2 === "N/A"}
                  />
                </td>

                <td>{item.alloc_qty_3}</td>
                <td>{item.warehouse_3}</td>
                <td>
                  <Input
                    type="number"
                    value={item.warehouse_3_qty}
                    onChange={(e) =>
                      handleQuantityChange(
                        item.id,
                        item.stock_code,
                        "warehouse_3_qty",
                        e.target.value,
                      )
                    }
                    slotProps={{
                      input: {
                        min: 0,
                        max: item.alloc_qty_3 ?? 0,
                      },
                    }}
                    placeholder="0"
                    disabled={isEditDisabled || item.warehouse_3 === "N/A"}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default CDPFormTable;
