import CDPFormDetails from "./CDPForm/CDPFormDetails";
import CDPFormTable from "./CDPForm/CDPFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { toast } from "react-toastify";
import { UnplannedAlloc, type AllocItemsFE } from "./interface";
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
  const [selectedAllocs, setSelectedAllocs] = useState<UnplannedAlloc[]>([]);
  const [formattedAllocs, setFormattedAllocs] = useState<AllocItemsFE[]>([]);

  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [amountDiscount, setAmountDiscount] = useState(0);
  const [remarks, setRemarks] = useState("");

  const totalItems = formattedAllocs.reduce(
    (sum, item) => sum + (Number(item.dp_qty) > 0 ? 1 : 0),
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

  useEffect(() => {
    const formattedAllocs = selectedAllocs
      .map((alloc: UnplannedAlloc) => {
        return alloc.allocation_items.map((allocItem) => {
          const itemObj = allocItem.customer_purchase_order.items.find(
            (item) => item.item_id === allocItem.item_id,
          );

          return {
            id: alloc.id,
            alloc_item_id: allocItem.id,
            stock_code: itemObj?.item.stock_code ?? "",
            name: itemObj?.item.name ?? "",
            cpo_id: allocItem.customer_purchase_order_id,
            alloc_qty: allocItem.total_available,
            dp_qty: "",
            cpo_item_volume: itemObj?.volume ?? 0,
            cpo_item_unserved: itemObj?.unserved_cpo ?? 0,
            price: itemObj?.price ?? 0,
            gross_amount: 0,
            net_amount: 0,
            customer_discount_1:
              allocItem.customer_purchase_order.customer_discount_1,
            customer_discount_2:
              allocItem.customer_purchase_order.customer_discount_2,
            customer_discount_3:
              allocItem.customer_purchase_order.customer_discount_3,

            transaction_discount_1:
              allocItem.customer_purchase_order.transaction_discount_1,
            transaction_discount_2:
              allocItem.customer_purchase_order.transaction_discount_2,
            transaction_discount_3:
              allocItem.customer_purchase_order.transaction_discount_3,
          };
        });
      })
      .flat();

    setFormattedAllocs(formattedAllocs);
  }, [selectedAllocs]);

  const resetForm = (): void => {
    setSelectedCustomer(null);
    setSelectedAllocs([]);
    setStatus("unposted");
    setTransactionDate(currentDate);
    setReferenceNumber("");
    setRemarks("");
  };

  const handleCreateDeliveryPlanning = async (): Promise<void> => {
    const payload = {
      status,
      transaction_date: transactionDate,
      reference_number: referenceNumber,
      remarks,
      customer_id: selectedCustomer?.customer_id,
      delivery_plan_items: formattedAllocs.map((allocItem) => {
        return {
          allocation_item_id: allocItem.alloc_item_id,
          planned_qty: allocItem.dp_qty,
        };
      }),
    };

    try {
      await axiosInstance.post("/api/delivery-plans/", payload);
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
        if (openCreate) await handleCreateDeliveryPlanning();
        // if (openEdit) await handleEditDeliveryReceipt();
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
      />
      <CDPFormTable
        selectedRow={selectedRow}
        formattedAllocs={formattedAllocs}
        setFormattedAllocs={setFormattedAllocs}
        selectedAllocs={selectedAllocs}
        setSelectedAllocs={setSelectedAllocs}
        totalGross={totalGross}
        totalNet={totalNet}
        totalItems={totalItems}
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

export default CDPForm;
