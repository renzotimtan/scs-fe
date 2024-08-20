import { useEffect, useState } from "react";
import { Box, Button, Table, Sheet, Input, Select, Option } from "@mui/joy";
import axiosInstance from "../../utils/axiosConfig";
import DeleteDeliveryReceiptModal from "./DeleteDeliveryReceiptModal";
import { toast } from "react-toastify";
import type {
  ViewDeliveryReceiptProps,
  PaginatedSDR,
  PaginationQueryParams,
} from "../../interface";

import { Pagination } from "@mui/material";

import { convertToQueryParams } from "../../helper";

const PAGE_LIMIT = 10;

const ViewDeliveryReceipt = ({
  setOpenCreate,
  setOpenEdit,
  selectedRow,
  setSelectedRow,
}: ViewDeliveryReceiptProps): JSX.Element => {
  const [deliveryReceipts, setDeliveryReceipts] = useState<PaginatedSDR>({
    total: 0,
    items: [],
  });
  const [openDelete, setOpenDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const getAllSDR = (): void => {
    const payload: PaginationQueryParams = {
      page,
      limit: PAGE_LIMIT,
      sort_by: "id",
      sort_order: "desc",
      search_term: searchTerm,
    };

    if (status !== "all") {
      payload.status = status;
    }

    axiosInstance
      .get<PaginatedSDR>(
        `/api/supplier-delivery-receipts/?${convertToQueryParams(payload)}`,
      )
      .then((response) => setDeliveryReceipts(response.data))
      .catch((error) => console.error("Error:", error));
  };

  const changePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ): void => {
    setPage(value);
    axiosInstance
      .get<PaginatedSDR>(
        `/api/supplier-delivery-receipts/?${convertToQueryParams({
          page: value,
          limit: PAGE_LIMIT,
          sort_by: "id",
          sort_order: "desc",
          search_term: searchTerm,
        })}`,
      )
      .then((response) => setDeliveryReceipts(response.data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    // Fetch SDRs
    getAllSDR();
  }, []);

  const handleDeleteDeliveryReceipt = async (): Promise<void> => {
    if (selectedRow !== undefined) {
      const url = `/api/supplier-delivery-receipts/${selectedRow.id}`;
      try {
        await axiosInstance.delete(url);
        toast.success("Archive successful!");
        setDeliveryReceipts((prevSDR) => ({
          ...prevSDR,
          items: prevSDR.items.map((SDR) =>
            SDR.id === selectedRow.id ? { ...SDR, status: "archived" } : SDR,
          ),
          total: prevSDR.total,
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
          <h2>Supplier Delivery Receipt</h2>
          <Button
            className="mt-2 mb-4 bg-button-primary"
            color="primary"
            onClick={() => {
              setOpenCreate(true);
            }}
          >
            Add Delivery Receipt
          </Button>
        </Box>
        <Box className="flex items-center mb-6">
          <Input
            size="sm"
            placeholder="Reference No."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            className="ml-4 w-[130px]"
            onChange={(event, value) => {
              if (value !== null) setStatus(value);
            }}
            size="sm"
            value={status}
          >
            <Option value="all">All</Option>
            <Option value="unposted">Unposted</Option>
            <Option value="posted">Posted</Option>
            <Option value="archived">Archived</Option>
          </Select>
          <Button
            onClick={getAllSDR}
            className="ml-4 w-[80px] bg-button-primary"
            size="sm"
          >
            Search
          </Button>
        </Box>

        <Sheet
          sx={{
            "--TableCell-height": "40px",
            // the number is the amount of the header rows.
            "--TableHeader-height": "calc(1 * var(--TableCell-height))",
            "--Table-firstColumnWidth": "150px",
            "--Table-lastColumnWidth": "160px",
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
              "& tbody tr:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.015)", // Add hover effect
                cursor: "pointer", // Change cursor on hover
              },
            }}
            borderAxis="both"
          >
            <thead>
              <tr>
                <th style={{ width: "var(--Table-firstColumnWidth)" }}>
                  SDR No.
                </th>
                <th style={{ width: 200 }}>Reference No.</th>
                <th style={{ width: 300 }}>Status</th>
                {/* <th style={{ width: 300 }}>Supplier</th> */}
                <th style={{ width: 250 }}>Transaction Date</th>
                <th style={{ width: 150 }}>Net Amount</th>
                <th style={{ width: 150 }}>FOB Total</th>
                <th style={{ width: 150 }}>Landed Total</th>
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
              {deliveryReceipts.items.map((deliveryReceipt) => (
                <tr
                  key={deliveryReceipt.id}
                  onDoubleClick={() => {
                    setOpenEdit(true);
                    setSelectedRow(deliveryReceipt);
                  }}
                >
                  <td>{deliveryReceipt.id}</td>
                  <td>{deliveryReceipt.reference_number}</td>
                  <td className="capitalize">{deliveryReceipt.status}</td>
                  <td>{deliveryReceipt.transaction_date}</td>
                  <td>{deliveryReceipt.net_amount}</td>
                  <td>{deliveryReceipt.fob_total}</td>
                  <td>{deliveryReceipt.landed_total}</td>
                  <td>{deliveryReceipt.remarks}</td>
                  <td>{deliveryReceipt?.creator?.username}</td>
                  <td>{deliveryReceipt?.modifier?.username}</td>
                  <td>{deliveryReceipt.date_created}</td>
                  <td>{deliveryReceipt.date_modified}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        className="w-[80px]"
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedRow(deliveryReceipt);
                        }}
                      >
                        {deliveryReceipt.status !== "unposted"
                          ? "View"
                          : "Edit"}
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        color="danger"
                        className="bg-delete-red"
                        onClick={() => {
                          setOpenDelete(true);
                          setSelectedRow(deliveryReceipt);
                        }}
                        disabled={deliveryReceipt.status !== "unposted"}
                      >
                        Archive
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
          count={Math.ceil(deliveryReceipts.total / PAGE_LIMIT)}
          page={page}
          onChange={changePage}
          shape="rounded"
          className="mt-7 ml-auto"
        />
      </Box>
      <DeleteDeliveryReceiptModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Archive Delivery Receipt"
        onDelete={handleDeleteDeliveryReceipt}
      />
    </>
  );
};

export default ViewDeliveryReceipt;
