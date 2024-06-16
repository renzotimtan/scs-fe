import STFormDetails from "./STForm/STFormDetails";
import RRFormTable from "./STForm/STFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
// import { v4 as uuid } from "uuid";
import axiosInstance from "../../utils/axiosConfig";
// import { toast } from "react-toastify";
import type { User } from "../../pages/Login";
import type {
  RRFormProps,
  DeliveryReceipt,
  PaginatedWarehouse,
  Warehouse,
  PaginatedRR,
  ReceivingReport,
} from "../../interface";

const StockTransferForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: RRFormProps): JSX.Element => {
  const [selectedSDRs, setSelectedSDRs] = useState<DeliveryReceipt[]>([]);
  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState("");
  const [remarks, setRemarks] = useState("");
  const [receivingReports, setReceivingReports] = useState<PaginatedRR>({
    total: 0,
    items: [],
  });
  const [selectedRR, setSelectedRR] = useState<ReceivingReport | null>(null);
  const [rrTransfer, setRRTransfer] = useState("no");
  const [userId, setUserId] = useState<number | null>(null);
  const [warehouses, setWarehouses] = useState<PaginatedWarehouse>({
    total: 0,
    items: [],
  });
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(
    null,
  );

  useEffect(() => {
    // Fetch warehouses
    axiosInstance
      .get<PaginatedWarehouse>("/api/warehouses/")
      .then((response) => {
        setWarehouses(response.data);
        setSelectedWarehouse(response.data.items[0]);
      })
      .catch((error) => console.error("Error:", error));

    // Fetch RR
    axiosInstance
      .get<PaginatedRR>("/api/receiving-reports/")
      .then((response) => {
        setReceivingReports(response.data);
      })
      .catch((error) => console.error("Error:", error));

    // Fetch user ID
    axiosInstance
      .get<User>("/users/me/")
      .then((response) => setUserId(response.data.id))
      .catch((error) => console.error("Error fetching user ID:", error));
  }, []);

  useEffect(() => {
    if (selectedRow !== null && selectedRow !== undefined) {
      setStatus(selectedRow?.status ?? "unposted");
      setTransactionDate(selectedRow?.transaction_date ?? "");
      setRemarks(selectedRow?.remarks ?? "");
      setSelectedSDRs(selectedRow?.sdrs);
    }
  }, [selectedRow]);

  const resetForm = (): void => {
    setSelectedSDRs([]);
    setStatus("unposted");
    setTransactionDate("");
    setRemarks("");
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        // if (openCreate) await handleCreateReceivingReport();
      }}
    >
      <div className="flex justify-between">
        <h2 className="mb-6">{title}</h2>
      </div>
      <STFormDetails
        openEdit={openEdit}
        selectedRow={selectedRow}
        status={status}
        setStatus={setStatus}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        remarks={remarks}
        setRemarks={setRemarks}
        rrTransfer={rrTransfer}
        setRRTransfer={setRRTransfer}
        warehouses={warehouses}
        selectedWarehouse={selectedWarehouse}
        setSelectedWarehouse={setSelectedWarehouse}
        receivingReports={receivingReports}
        selectedRR={selectedRR}
        setSelectedRR={setSelectedRR}
      />
      <RRFormTable />
      <Divider />
      <div className="flex justify-end mt-4">
        <Button
          className="ml-4 w-[130px]"
          size="sm"
          variant="outlined"
          onClick={() => {
            setOpen(false);
          }}
        >
          <DoDisturbIcon className="mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          className="ml-4 w-[130px] bg-button-primary"
          size="sm"
        >
          <SaveIcon className="mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
};

export default StockTransferForm;
