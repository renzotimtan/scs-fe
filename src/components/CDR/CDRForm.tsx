import CDRFormDetails from "./CDRForm/CDRFormDetails";
import CDRFormTable from "./CDRForm/CDRFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { toast } from "react-toastify";
import { UnplannedAlloc, type AllocItemsFE } from "./interface";
import type {
  CDRFormProps,
  PaginatedCustomers,
  Customer,
  Alloc,
  DeliveryPlanItem,
  CPO,
  CDP,
  CDR,
  PaginatedCDP,
} from "../../interface";

const CDRForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: CDRFormProps): JSX.Element => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [customers, setCustomers] = useState<PaginatedCustomers>({
    total: 0,
    items: [],
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [selectedDP, setSelectedDP] = useState<CDP | null>(null);
  const [formattedAllocs, setFormattedAllocs] = useState<AllocItemsFE[]>([]);

  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [amountDiscount, setAmountDiscount] = useState(0);
  const [remarks, setRemarks] = useState("");

  const totalItems = formattedAllocs.reduce(
    (sum, item) => sum + (Number(item.dp_qty)),
    0,
  );

  const totalGross = formattedAllocs.reduce(
    (sum, item) => sum + (item.gross_amount ?? 0),
    0,
  );

  const totalNet =
    formattedAllocs.reduce((sum, item) => sum + (item.net_amount ?? 0), 0) -
    amountDiscount;

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
      setAmountDiscount(Number(selectedRow?.discount_amount));

      axiosInstance
        .get<CDP>(`/api/delivery-plans/${selectedRow.delivery_plan_id}`)
        .then((response) => setSelectedDP(response.data))
        .catch((error) => console.error("Error:", error));
      //

      // Get Customer for Edit
      axiosInstance
        .get<Customer>(`/api/customers/${customerID}`)
        .then((response) => {
          setSelectedCustomer(response.data);
        })
        .catch((error) => console.error("Error:", error));

      // Fill in formatted allocs for table
      const formattedAllocs = selectedRow.receipt_items.map((DRItem) => {
        const DPItem = DRItem.delivery_plan_item;

        const itemObj =
          DPItem.allocation_item.customer_purchase_order.items.find(
            (item) => item.item_id === DPItem.allocation_item.item_id,
          );

        return {
          id: DPItem.allocation_item.allocation_id,
          stock_code: itemObj?.item.stock_code ?? "",
          cpo_id: DPItem.allocation_item.customer_purchase_order_id,
          name: itemObj?.item.name ?? "",
          dp_qty: String(DPItem.planned_qty),
          price: itemObj?.price ?? 0,
          gross_amount: (itemObj?.price ?? 0) * DPItem.planned_qty,
          net_amount: calculateNetForRow(
            Number(DPItem.planned_qty),
            DPItem.allocation_item.customer_purchase_order,
            itemObj?.price ?? 0,
          ),
          delivery_plan_item_id: selectedRow.delivery_plan_id,

          customer_discount_1:
            DPItem.allocation_item.customer_purchase_order.customer_discount_1,
          customer_discount_2:
            DPItem.allocation_item.customer_purchase_order.customer_discount_2,
          customer_discount_3:
            DPItem.allocation_item.customer_purchase_order.customer_discount_3,

          transaction_discount_1:
            DPItem.allocation_item.customer_purchase_order
              .transaction_discount_1,
          transaction_discount_2:
            DPItem.allocation_item.customer_purchase_order
              .transaction_discount_2,
          transaction_discount_3:
            DPItem.allocation_item.customer_purchase_order
              .transaction_discount_3,
        };
      });

      setFormattedAllocs(formattedAllocs);
    }
  }, [selectedRow]);

  const calculateNetForRow = (
    newValue: number,
    allocItem: any,
    price: number,
  ): number => {
    let result = newValue * price;

    if (allocItem.customer_discount_1.includes("%")) {
      const cd1 = allocItem.customer_discount_1.slice(0, -1);
      result = result - result * (parseFloat(cd1) / 100);
    }

    if (allocItem.customer_discount_2.includes("%")) {
      const cd2 = allocItem.customer_discount_2.slice(0, -1);
      result = result - result * (parseFloat(cd2) / 100);
    }

    if (allocItem.customer_discount_3.includes("%")) {
      const cd3 = allocItem.customer_discount_3.slice(0, -1);
      result = result - result * (parseFloat(cd3) / 100);
    }

    if (allocItem.transaction_discount_1.includes("%")) {
      const td1 = allocItem.transaction_discount_1.slice(0, -1);
      result = result - result * (parseFloat(td1) / 100);
    }

    if (allocItem.transaction_discount_2.includes("%")) {
      const td2 = allocItem.transaction_discount_2.slice(0, -1);
      result = result - result * (parseFloat(td2) / 100);
    }

    if (allocItem.transaction_discount_3.includes("%")) {
      const td3 = allocItem.transaction_discount_3.slice(0, -1);
      result = result - result * (parseFloat(td3) / 100);
    }

    if (isNaN(result)) return 0;

    return result;
  };

  const resetForm = (): void => {
    setSelectedCustomer(null);
    setFormattedAllocs([]);
    setStatus("unposted");
    setTransactionDate(currentDate);
    setReferenceNumber("");
    setRemarks("");
    setAmountDiscount(0);
  };

  const createPayload = () => {
    const payload = {
      status,
      transaction_date: transactionDate,
      discount_amount: amountDiscount,
      reference_number: referenceNumber,
      remarks,
      delivery_plan_id: selectedDP?.id,
      total_net: totalNet,
      total_gross: totalGross,
      total_items: totalItems,
      receipt_items: formattedAllocs.map((allocItem) => {
        return {
          delivery_plan_item_id: allocItem.delivery_plan_item_id,
          delivered_qty: allocItem.dp_qty,
        };
      }),
    };
    return payload;
  };

  const handleCreateDeliveryReceipt = async (): Promise<void> => {
    const payload = createPayload();
    try {
      await axiosInstance.post("/api/delivery-receipts/", payload);
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
        `/api/delivery-plans/${selectedRow?.id}`,
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
      <CDRFormDetails
        openEdit={openEdit}
        selectedRow={selectedRow}
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        formattedAllocs={formattedAllocs}
        setFormattedAllocs={setFormattedAllocs}
        status={status}
        setStatus={setStatus}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        remarks={remarks}
        setRemarks={setRemarks}
        referenceNumber={referenceNumber}
        setReferenceNumber={setReferenceNumber}
        isEditDisabled={isEditDisabled}
        totalNet={totalNet}
        totalGross={totalGross}
        totalItems={totalItems}
        amountDiscount={amountDiscount}
        setAmountDiscount={setAmountDiscount}
        selectedDP={selectedDP}
        setSelectedDP={setSelectedDP}
      />
      <CDRFormTable
        selectedRow={selectedRow}
        formattedAllocs={formattedAllocs}
        setFormattedAllocs={setFormattedAllocs}
        totalGross={totalGross}
        totalNet={totalNet}
        totalItems={totalItems}
        openEdit={openEdit}
        isEditDisabled={isEditDisabled}
        selectedDP={selectedDP}
        setSelectedDP={setSelectedDP}
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

export default CDRForm;
