import { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import axiosInstance from "../../utils/axiosConfig";
import DeletePurchaseOrderModal from "./DeletePurchaseOrderModal";
import { toast } from "react-toastify";
import type { ViewPurchaseOrderProps, PaginatedPO } from "../../interface";

import { Pagination } from "@mui/material";

import { convertToQueryParams } from "../../helper";

const PAGE_LIMIT = 10;

const ViewPurchaseOrder = ({
  setOpenCreate,
  setOpenEdit,
  selectedRow,
  setSelectedRow,
}: ViewPurchaseOrderProps): JSX.Element => {
  const [purchaseOrders, setPurchaseOrders] = useState<PaginatedPO>({
    total: 0,
    items: [],
  });
  const [openDelete, setOpenDelete] = useState(false);

  const [page, setPage] = useState(1);
  const changePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ): void => {
    setPage(value);

    axiosInstance
      .get<PaginatedPO>(
        `/api/purchase_orders/?${convertToQueryParams({
          page: value,
          limit: PAGE_LIMIT,
          sort_by: "id",
          sort_order: "desc",
          search_term: "",
        })}`,
      )
      .then((response) => setPurchaseOrders(response.data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    // Fetch purchase orders
    axiosInstance
      .get<PaginatedPO>(
        `/api/purchase_orders/?${convertToQueryParams({
          page,
          limit: PAGE_LIMIT,
          sort_by: "id",
          sort_order: "desc",
          search_term: "",
        })}`,
      )
      .then((response) => setPurchaseOrders(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleDeletePurchaseOrder = async (): Promise<void> => {
    if (selectedRow !== undefined) {
      const url = `/api/purchase_orders/${selectedRow.id}`;
      try {
        await axiosInstance.delete(url);
        toast.success("Delete successful!");
        setPurchaseOrders((prevPO) => ({
          ...prevPO,
          items: prevPO.items.filter((PO) => PO.id !== selectedRow.id),
          total: prevPO.total - 1,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box className="flex justify-between mb-6">
          <h2>Purchase Order</h2>
          <Button
            className="mt-2 mb-4 bg-button-primary"
            color="primary"
            onClick={() => {
              setOpenCreate(true);
            }}
          >
            Add Purchase Order
          </Button>
        </Box>
        <Sheet
          sx={{
            "--TableCell-height": "40px",
            // the number is the amount of the header rows.
            "--TableHeader-height": "calc(1 * var(--TableCell-height))",
            "--Table-firstColumnWidth": "150px",
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
            ),
            radial-gradient(
                farthest-side at 100% 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
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
              "& tr > *:last-child": {
                position: "sticky",
                right: 0,
                bgcolor: "var(--TableCell-headBackground)",
              },
            }}
            borderAxis="both"
          >
            <thead>
              <tr>
                <th style={{ width: "var(--Table-firstColumnWidth)" }}>
                  PO Number
                </th>
                <th style={{ width: 300 }}>Status</th>
                <th style={{ width: 300 }}>Supplier</th>
                <th style={{ width: 250 }}>Transaction Date</th>
                <th style={{ width: 150 }}>Currency Used</th>
                <th style={{ width: 150 }}>Peso Rate</th>
                <th style={{ width: 150 }}>Net Amount</th>
                <th style={{ width: 150 }}>FOB Total</th>
                <th style={{ width: 150 }}>Landed Total</th>
                <th style={{ width: 200 }}>Reference Number</th>
                <th style={{ width: 300 }}>Remarks</th>
                <th style={{ width: 200 }}>Created By</th>
                <th style={{ width: 200 }}>Modified By</th>
                <th style={{ width: 250 }}>Date Created</th>
                <th style={{ width: 250 }}>Date Modified</th>
                <th
                  aria-label="last"
                  style={{ width: "var(--Table-lastColumnWidth)" }}
                />
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.items.map((purchaseOrder) => (
                <tr key={purchaseOrder.id}>
                  <td>{purchaseOrder.id}</td>
                  <td className="capitalize">{purchaseOrder.status}</td>
                  <td>{purchaseOrder?.supplier?.name}</td>
                  <td>{purchaseOrder.transaction_date}</td>
                  <td>{purchaseOrder.currency_used}</td>
                  <td>{purchaseOrder.peso_rate}</td>
                  <td>{purchaseOrder.net_amount}</td>
                  <td>{purchaseOrder.fob_total}</td>
                  <td>{purchaseOrder.landed_total}</td>
                  <td>{purchaseOrder.reference_number}</td>
                  <td>{purchaseOrder.remarks}</td>
                  <td>{purchaseOrder?.creator?.username}</td>
                  <td>{purchaseOrder?.modifier?.username}</td>
                  <td>{purchaseOrder.date_created}</td>
                  <td>{purchaseOrder.date_modified}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedRow(purchaseOrder);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        color="danger"
                        className="bg-delete-red"
                        onClick={() => {
                          setOpenDelete(true);
                          setSelectedRow(purchaseOrder);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </Box>
      <Box className="flex align-center justify-end">
        <Pagination
          count={Math.floor(purchaseOrders.total / PAGE_LIMIT) + 1}
          page={page}
          onChange={changePage}
          shape="rounded"
          className="mt-7 ml-auto"
        />
      </Box>
      <DeletePurchaseOrderModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Purchase Order"
        onDelete={handleDeletePurchaseOrder}
      />
    </>
  );
};

export default ViewPurchaseOrder;
