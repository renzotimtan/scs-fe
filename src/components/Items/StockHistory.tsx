import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Card, Box, Table } from "@mui/joy";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";

import type { ViewStockHistory, StockHistory } from "../../interface";

const StockHistory = ({
  open,
  setOpen,
  row,
}: ViewStockHistory): JSX.Element => {
  const [stockHistory, setStockHistory] = useState<StockHistory[]>([]);

  useEffect(() => {
    axiosInstance
      .get(`/api/items/stock-history/?stock_code=${row?.stock_code}`)
      .then((response) => setStockHistory(response.data))
      .catch((error) => console.error("Error:", error));
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
          <h3 className="mb-6">Stock History</h3>
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
                      Tx Type
                    </th>
                    <th style={{ width: 100 }}>Code</th>
                    <th style={{ width: 100 }}>Name</th>
                    <th style={{ width: 100 }}>Tx Date</th>
                    <th style={{ width: 100 }}>Tx No.</th>
                    <th style={{ width: 100 }}>In</th>
                    <th style={{ width: 100 }}>Out</th>
                    <th style={{ width: 100 }}>Price</th>
                    <th style={{ width: 100 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {stockHistory &&
                    stockHistory.map((history: StockHistory) => (
                      <tr
                        key={`${history.transaction_number}-${history.stock_code}`}
                      >
                        <td>{history.transaction_type}</td>
                        <td>{history.stock_code}</td>
                        <td>{history.stock_description}</td>
                        <td>{history.transaction_date}</td>
                        <td>{history.transaction_number}</td>
                        <td>{history.quantity_in}</td>
                        <td>{history.quantity_out}</td>
                        <td>{history.price}</td>
                        <td>{history.amount}</td>
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

export default StockHistory;
