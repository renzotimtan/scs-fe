import CDPFormDetails from "./CDPForm/CDPFormDetails";
import CDPFormTable from "./CDPForm/CDPFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { toast } from "react-toastify";
import { type AllocItemsFE } from "./interface";
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
  const [formattedAllocs, setFormattedAllocs] = useState<AllocItemsFE[]>([]);

  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  const [totalItems, setTotalItems] = useState(0);

  const totalGross = formattedAllocs.reduce(
    (sum, item) => sum + (item.gross_amount ?? 0),
    0,
  );

  const totalNet = formattedAllocs.reduce(
    (sum, item) => sum + (item.net_amount ?? 0),
    0,
  );

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
      .map((alloc) => {
        return alloc.allocation_items.map((allocItem) => {
          const warehouse1 =
            allocItem.warehouse_allocations[0]?.warehouse_item.warehouse.name ??
            "N/A";
          const warehouse2 =
            allocItem.warehouse_allocations[1]?.warehouse_item.warehouse.name ??
            "N/A";
          const warehouse3 =
            allocItem.warehouse_allocations[2]?.warehouse_item.warehouse.name ??
            "N/A";

          return {
            id: alloc.id,
            stock_code: allocItem.item.stock_code,
            name: allocItem.item.name,

            price: 100,
            gross_amount: 0,
            net_amount: 0,

            // allocations
            alloc_qty_1:
              allocItem.warehouse_allocations[0]?.allocated_qty ?? "N/A",
            warehouse_1: warehouse1,
            warehouse_1_qty: undefined,

            alloc_qty_2:
              allocItem.warehouse_allocations[1]?.allocated_qty ?? "N/A",
            warehouse_2: warehouse2,
            warehouse_2_qty: undefined,

            alloc_qty_3:
              allocItem.warehouse_allocations[2]?.allocated_qty ?? "N/A",
            warehouse_3: warehouse3,
            warehouse_3_qty: undefined,
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
        totalNet={totalNet}
        totalGross={totalGross}
      />
      <CDPFormTable
        selectedRow={selectedRow}
        formattedAllocs={formattedAllocs}
        setFormattedAllocs={setFormattedAllocs}
        selectedAllocs={selectedAllocs}
        setSelectedAllocs={setSelectedAllocs}
        setTotalItems={setTotalItems}
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
