import ARFormDetails from "./ARForm/ARFormDetails";
import CRFormTable from "./ARForm/ARFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { toast } from "react-toastify";
import { type DRItemsFE } from "./interface";
import type {
  CRFormProps,
  PaginatedCustomers,
  Customer,
  PaginatedWarehouse,
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
  const [formattedDRs, setFormattedDRs] = useState<DRItemsFE[]>([]);
  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [remarks, setRemarks] = useState("");

  const [paymentMode, setPaymentMode] = useState("cash");
  const [checkDate, setCheckDate] = useState("");
  const [checkNumber, setCheckNumber] = useState("");
  const [bankName, setBankName] = useState("");

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

  const calculateNetForRow = (
    newValue: number,
    price: number,
    DRItem: any,
  ): number => {
    let result = newValue * price;

    if (DRItem.customer_discount_1.includes("%")) {
      const cd1 = DRItem.customer_discount_1.slice(0, -1);
      result = result - result * (parseFloat(cd1) / 100);
    }

    if (DRItem.customer_discount_2.includes("%")) {
      const cd2 = DRItem.customer_discount_2.slice(0, -1);
      result = result - result * (parseFloat(cd2) / 100);
    }

    if (DRItem.customer_discount_3.includes("%")) {
      const cd3 = DRItem.customer_discount_3.slice(0, -1);
      result = result - result * (parseFloat(cd3) / 100);
    }

    if (DRItem.transaction_discount_1.includes("%")) {
      const td1 = DRItem.transaction_discount_1.slice(0, -1);
      result = result - result * (parseFloat(td1) / 100);
    }

    if (DRItem.transaction_discount_2.includes("%")) {
      const td2 = DRItem.transaction_discount_2.slice(0, -1);
      result = result - result * (parseFloat(td2) / 100);
    }

    if (DRItem.transaction_discount_3.includes("%")) {
      const td3 = DRItem.transaction_discount_3.slice(0, -1);
      result = result - result * (parseFloat(td3) / 100);
    }

    if (isNaN(result)) return 0;

    return result;
  };

  const resetForm = (): void => {
    setSelectedCustomer(null);
    setFormattedDRs([]);
    setStatus("unposted");
    setTransactionDate(currentDate);
    setRemarks("");
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

  const handleCreateDeliveryPlanning = async (): Promise<void> => {
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

  const handleEditDeliveryReceipt = async (): Promise<void> => {
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
        if (openCreate) await handleCreateDeliveryPlanning();
        if (openEdit) await handleEditDeliveryReceipt();
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
        formattedDRs={formattedDRs}
        setFormattedDRs={setFormattedDRs}
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
        bankName={bankName}
        setBankName={setBankName}
      />
      {/* <CRFormTable
        selectedRow={selectedRow}
        warehouses={warehouses}
        formattedDRs={formattedDRs}
        setFormattedDRs={setFormattedDRs}
        totalGross={totalGross}
        totalItems={totalItems}
        openEdit={openEdit}
        isEditDisabled={isEditDisabled}
      /> */}
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
