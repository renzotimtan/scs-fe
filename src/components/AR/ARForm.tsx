import ARFormDetails from "./ARForm/ARFormDetails";
import ARFormTable from "./ARForm/ARFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { toast } from "react-toastify";
import { type OutstandingTrans } from "./interface";
import type {
  CRFormProps,
  PaginatedCustomers,
  Customer,
} from "../../interface";

const ARForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: CRFormProps): JSX.Element => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [customers, setCustomers] = useState<PaginatedCustomers>({
    total: 0,
    items: [],
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [outstandingTrans, setOutstandingTrans] = useState<OutstandingTrans[]>(
    [],
  );
  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [remarks, setRemarks] = useState("");

  const [paymentMode, setPaymentMode] = useState("cash");
  const [checkDate, setCheckDate] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [amountPaid, setAmountPaid] = useState("");

  const [addAmount1, setAddAmount1] = useState("");
  const [addAmount2, setAddAmount2] = useState("");
  const [addAmount3, setAddAmount3] = useState("");
  const [lessAmount, setLessAmount] = useState("");

  const totalApplied = outstandingTrans.reduce(
    (total, trans) => total + Number(trans.payment),
    0,
  );
  const addAmount = addAmount1 + addAmount2 + addAmount3;
  const paymentAmount = totalApplied - Number(lessAmount) + Number(addAmount);

  const isEditDisabled =
    selectedRow !== undefined && selectedRow?.status !== "unposted";

  useEffect(() => {
    // Fetch customers
    axiosInstance
      .get<PaginatedCustomers>("/api/customers/")
      .then((response) => setCustomers(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    // Set fields for Edit
    const customerID = selectedRow?.customer.customer_id;

    if (selectedRow !== null && selectedRow !== undefined) {
      setStatus(selectedRow?.status ?? "unposted");
      setTransactionDate(selectedRow?.transaction_date ?? currentDate);
      setRemarks(selectedRow?.remarks ?? "");

      // Get Customer for Edit
      axiosInstance
        .get<Customer>(`/api/customers/${customerID}`)
        .then((response) => {
          setSelectedCustomer(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedRow]);

  const fetchARByCustomer = (customerId: number | null) => {
    // Fetch ARs
    axiosInstance
      .get<OutstandingTrans[]>(
        `/api/ar-receipts/customer/${customerId}/outstanding-transactions`,
      )
      .then((response) =>
        setOutstandingTrans(
          response.data.map((trans) => {
            return { ...trans, payment: "" };
          }),
        ),
      )
      .catch((error) => console.error("Error:", error));
  };

  const resetForm = (): void => {
    setSelectedCustomer(null);
    setOutstandingTrans([]);
    setStatus("unposted");
    setTransactionDate(currentDate);
    setRemarks("");
    setPaymentMode("cash");
    setCheckDate("");
    setCheckNumber("");
    setAmountPaid("");
    setAddAmount1("");
    setAddAmount2("");
    setAddAmount3("");
    setLessAmount("");
  };

  const createPayload = () => {
    const payload = {
      status,
      transaction_date: transactionDate,
      reference_number: referenceNumber,
      remarks,
      customer_id: selectedCustomer?.customer_id,
      items: formattedDRs
        .filter((DRItem) => DRItem.return_qty && Number(DRItem.return_qty) > 0)
        .map((DRItem) => {
          return {
            delivery_receipt_item_id: DRItem.delivery_receipt_item_id,
            warehouse_id: DRItem?.return_warehouse?.id ?? null,
            item_id: DRItem.item_id,
            return_qty: DRItem.return_qty,
            price: DRItem.price,
          };
        }),
    };
    return payload;
  };

  const handleCreateAR = async (): Promise<void> => {
    const payload = createPayload();
    try {
      await axiosInstance.post("/api/customer-returns/", payload);
      toast.success("Save successful!");
      resetForm();
      setOpen(false);
      // Handle the response, update state, etc.
    } catch (error: any) {
      toast.error(
        `Error message: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
      );
    }
  };

  const handleEditAR = async (): Promise<void> => {
    const payload = createPayload();

    try {
      await axiosInstance.put(
        `/api/customer-returns/${selectedRow?.id}`,
        payload,
      );
      toast.success("Save successful!");
      resetForm();
      setOpen(false);
      // Handle the response, update state, etc.
    } catch (error: any) {
      toast.error(
        `Error message: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
      );
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (openCreate) await handleCreateAR();
        if (openEdit) await handleEditAR();
      }}
    >
      <div className="flex justify-between">
        <h2 className="mb-6">{title}</h2>
        <Button
          className="w-[130px] h-[35px] bg-button-neutral"
          size="sm"
          color="neutral"
        >
          <LocalPrintshopIcon className="mr-2" />
          Print
        </Button>
      </div>
      <ARFormDetails
        openEdit={openEdit}
        selectedRow={selectedRow}
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        fetchARByCustomer={fetchARByCustomer}
        status={status}
        setStatus={setStatus}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        remarks={remarks}
        setRemarks={setRemarks}
        isEditDisabled={isEditDisabled}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        checkDate={checkDate}
        setCheckDate={setCheckDate}
        checkNumber={checkNumber}
        setCheckNumber={setCheckNumber}
        amountPaid={amountPaid}
        setAmountPaid={setAmountPaid}
        addAmount1={addAmount1}
        addAmount2={addAmount2}
        addAmount3={addAmount3}
        setAddAmount1={setAddAmount1}
        setAddAmount2={setAddAmount2}
        setAddAmount3={setAddAmount3}
        lessAmount={lessAmount}
        setLessAmount={setLessAmount}
        totalApplied={totalApplied}
        paymentAmount={paymentAmount}
      />
      <ARFormTable
        outstandingTrans={outstandingTrans}
        setOutstandingTrans={setOutstandingTrans}
        selectedRow={selectedRow}
        openEdit={openEdit}
        isEditDisabled={isEditDisabled}
      />
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
          {isEditDisabled ? "Go Back" : "Cancel"}
        </Button>
        {!isEditDisabled && (
          <Button
            type="submit"
            className="ml-4 w-[130px] bg-button-primary"
            size="sm"
          >
            <SaveIcon className="mr-2" />
            Save
          </Button>
        )}
      </div>
    </form>
  );
};

export default ARForm;
