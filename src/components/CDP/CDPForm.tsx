import CDPFormDetails from "./CDPForm/CDPFormDetails";
import SDRFormTable from "./CDPForm/CDPFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { toast } from "react-toastify";
import type { User } from "../../pages/Login";
import type {
  CDPFormProps,
  PaginatedCustomers,
  Customer,
  Alloc,
} from "../../interface";

const CDPForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: CDPFormProps): JSX.Element => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [customers, setCustomers] = useState<PaginatedCustomers>({
    total: 0,
    items: [],
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [selectedAllocs, setSelectedAllocs] = useState<Alloc[]>([]);
  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  const [totalGross, setTotalGross] = useState(0);
  const [totalNet, setTotalNet] = useState(0);
  const [servedAmt, setServedAmt] = useState<Record<string, number>>({});

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
      setReferenceNumber(selectedRow?.reference_number ?? "");
      setRemarks(selectedRow?.remarks ?? "");
      // setSelectedPOs(selectedRow?.purchase_orders);

      // Get Supplier for Edit
      axiosInstance
        .get<Customer>(`/api/customers/${customerID}`)
        .then((response) => {
          setSelectedCustomer(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedRow]);

  const resetForm = (): void => {
    setSelectedCustomer(null);
    setSelectedAllocs([]);
    setStatus("unposted");
    setTransactionDate(currentDate);
    setReferenceNumber("");
    setRemarks("");
  };

  const handleCreateDeliveryReceipt = async (): Promise<void> => {
    // const payload = {
    //   sdr_data: {
    //     status,
    //     transaction_date: transactionDate,
    //     reference_number: referenceNumber,
    //     remarks,
    //     created_by: userId,
    //   },
    //   items_data: selectedPOs.flatMap((PO, index1) =>
    //     PO.items.map((POItem, index2) => {
    //       const key = `${PO.id}-${POItem.id}-${index1}-${index2}`;
    //       return {
    //         purchase_order_id: PO.id,
    //         item_id: POItem.item_id,
    //         volume: POItem.volume,
    //         price: POItem.price,
    //         total_price: POItem.total_price,
    //         id: POItem.id,
    //         unserved_spo: POItem.unserved_spo,
    //         on_stock: POItem.on_stock,
    //         in_transit: servedAmt[key],
    //         allocated: POItem.allocated,
    //       };
    //     }),
    //   ),
    // };

    // try {
    //   await axiosInstance.post("/api/supplier-delivery-receipts/", payload);
    //   toast.success("Save successful!");
    //   resetForm();
    //   setOpen(false);
    //   // Handle the response, update state, etc.
    // } catch (error: any) {
    //   toast.error(
    //     `Error message: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
    //   );
    // }
    console.log("Post");
  };

  const handleEditDeliveryReceipt = async (): Promise<void> => {
    // const payload = {
    //   sdr_data: {
    //     status,
    //     transaction_date: transactionDate,
    //     reference_number: referenceNumber,
    //     remarks,
    //     modified_by: userId,
    //   },
    //   items_data: selectedPOs.flatMap((PO, index1) =>
    //     PO.items.map((POItem, index2) => {
    //       const key = `${PO.id}-${POItem.id}-${index1}-${index2}`;
    //       return {
    //         purchase_order_id: PO.id,
    //         item_id: POItem.item_id,
    //         volume: POItem.volume,
    //         price: POItem.price,
    //         total_price: POItem.total_price,
    //         id: POItem.id,
    //         unserved_spo: POItem.unserved_spo,
    //         on_stock: POItem.on_stock,
    //         in_transit: servedAmt[key],
    //         allocated: POItem.allocated,
    //       };
    //     }),
    //   ),
    // };

    // try {
    //   await axiosInstance.put(
    //     `/api/supplier-delivery-receipts/${selectedRow?.id}`,
    //     payload,
    //   );
    //   toast.success("Save successful!");
    //   resetForm();
    //   setOpen(false);
    //   // Handle the response, update state, etc.
    // } catch (error: any) {
    //   toast.error(
    //     `Error message: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
    //   );
    // }
    console.log("Edit");
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (openCreate) await handleCreateDeliveryReceipt();
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
      <CDPFormDetails
        openEdit={openEdit}
        selectedRow={selectedRow}
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        selectedAllocs={selectedAllocs}
        setSelectedAllocs={setSelectedAllocs}
        status={status}
        setStatus={setStatus}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        remarks={remarks}
        setRemarks={setRemarks}
        referenceNumber={referenceNumber}
        setReferenceNumber={setReferenceNumber}
        isEditDisabled={isEditDisabled}
      />
      {/* <SDRFormTable
        selectedRow={selectedRow}
        selectedPOs={selectedPOs}
        setSelectedPOs={setSelectedPOs}
        totalNet={totalNet}
        servedAmt={servedAmt}
        setServedAmt={setServedAmt}
        setTotalNet={setTotalNet}
        setTotalGross={setTotalGross}
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

export default CDPForm;
