import { useEffect, useState } from "react";
import { Box, Button, Table, Sheet, Input, Select, Option } from "@mui/joy";
import axiosInstance from "../../utils/axiosConfig";
import DeleteDeliveryReceiptModal from "./DeleteRRModal";
import { toast } from "react-toastify";
import type {
  PaginatedRR,
  PaginationQueryParams,
  ViewReceivingReportProps,
} from "../../interface";

import { Pagination } from "@mui/material";

import { convertToQueryParams } from "../../helper";

const PAGE_LIMIT = 10;

const ViewReceivingReport = ({
  setOpenCreate,
  setOpenEdit,
  selectedRow,
  setSelectedRow,
}: ViewReceivingReportProps): JSX.Element => {
  const [receivingReports, setReceivingReports] = useState<PaginatedRR>({
    total: 0,
    items: [],
  });
  const [openDelete, setOpenDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const getAllRR = (): void => {
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
      .get<PaginatedRR>(
        `/api/receiving-reports/?${convertToQueryParams(payload)}`,
      )
      .then((response) => setReceivingReports(response.data))
      .catch((error) => console.error("Error:", error));
  };

  const changePage = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ): void => {
    setPage(value);
    axiosInstance
      .get<PaginatedRR>(
        `/api/receiving-reports/?${convertToQueryParams({
          page: value,
          limit: PAGE_LIMIT,
          sort_by: "id",
          sort_order: "desc",
          search_term: searchTerm,
        })}`,
      )
      .then((response) => setReceivingReports(response.data))
      .catch((error) => console.error("Error:", error));
  };

  useEffect(() => {
    // Fetch RRs
    getAllRR();
  }, []);

  const handleDeleteDeliveryReceipt = async (): Promise<void> => {
    if (selectedRow !== undefined) {
      const url = `/api/supplier-delivery-receipts/${selectedRow.id}`;
      try {
        await axiosInstance.delete(url);
        toast.success("Delete successful!");
        setReceivingReports((prevRR) => ({
          ...prevRR,
          items: prevRR.items.filter((RR) => RR.id !== selectedRow.id),
          total: prevRR.total - 1,
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
          <h2>Receiving Report</h2>
          <Button
            className="mt-2 mb-4 bg-button-primary"
            color="primary"
            onClick={() => {
              setOpenCreate(true);
            }}
          >
            Add Receiving Report
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
            onClick={getAllRR}
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
                  RR No.
                </th>
                <th style={{ width: 200 }}>Reference No.</th>
                <th style={{ width: 300 }}>Status</th>
                {/* <th style={{ width: 300 }}>Supplier</th> */}
                <th style={{ width: 250 }}>Transaction Date</th>
                <th style={{ width: 150 }}>Net Amount</th>
                <th style={{ width: 150 }}>FOB Total</th>
                <th style={{ width: 150 }}>Landed Total</th>
                <th style={{ width: 300 }}>Remarks</th>
                <th style={{ width: 300 }}>Currency</th>
                <th style={{ width: 300 }}>Rate</th>
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
              {receivingReports.items.map((receivingReport) => (
                <tr key={receivingReport.id}>
                  <td>{receivingReport.id}</td>
                  <td>{receivingReport.reference_number}</td>
                  <td className="capitalize">{receivingReport.status}</td>
                  <td>{receivingReport.transaction_date}</td>
                  <td>{receivingReport.net_amount}</td>
                  <td>{receivingReport.fob_total}</td>
                  <td>{receivingReport.landed_total}</td>
                  <td>{receivingReport.remarks}</td>
                  <td>{receivingReport.currency}</td>
                  <td>{receivingReport.rate}</td>
                  <td>{receivingReport?.creator?.username}</td>
                  <td>{receivingReport?.modifier?.username}</td>
                  <td>{receivingReport.date_created}</td>
                  <td>{receivingReport.date_modified}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedRow(receivingReport);
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
                          setSelectedRow(receivingReport);
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
          count={Math.ceil(receivingReports.total / PAGE_LIMIT)}
          page={page}
          onChange={changePage}
          shape="rounded"
          className="mt-7 ml-auto"
        />
      </Box>
      <DeleteDeliveryReceiptModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Delivery Receipt"
        onDelete={handleDeleteDeliveryReceipt}
      />
    </>
  );
};

export default ViewReceivingReport;
