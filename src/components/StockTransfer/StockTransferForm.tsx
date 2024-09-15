import STFormDetails from "./STForm/STFormDetails";
import STFormTable from "./STForm/STFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import type { User } from "../../pages/Login";
import type {
  PaginatedWarehouse,
  Warehouse,
  PaginatedRR,
  ReceivingReport,
  STFormProps,
  WarehouseItem,
} from "../../interface";

import { STFormPayload } from "./interface";

const StockTransferForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: STFormProps): JSX.Element => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
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

  //  Initialize state of selectedWarehouseItem outside of component to avoid creating new object on each render
  const INITIAL_SELECTED_ITEMS = [{ id: null }];

  const [selectedWarehouseItem, setSelectedWarehouseItem] = useState<any>(
    INITIAL_SELECTED_ITEMS,
  );
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItem[]>([]);

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
      setTransactionDate(selectedRow?.transaction_date ?? currentDate);
      setRemarks(selectedRow?.remarks ?? "");
    }
  }, [selectedRow]);

  const createStockTransferDetails = () => {
    const results = [];

    for (const warehouseItem of selectedWarehouseItem) {
      if (warehouseItem?.id !== null && selectedWarehouse !== null) {
        const result: STFormPayload = {
          warehouse_id: selectedWarehouse.id,
          item_id: warehouseItem.item_id,
          product_name: warehouseItem.item.name,
          unit_code: warehouseItem.item.stock_code,
          destinations: [],
        };

        if (warehouseItem.firstWarehouse !== null) {
          result.destinations.push({
            to_warehouse_id: warehouseItem.firstWarehouse.id,
            quantity: warehouseItem.firstWarehouseAmt,
          });
        }

        if (warehouseItem.secondWarehouse !== null) {
          result.destinations.push({
            to_warehouse_id: warehouseItem.secondWarehouse.id,
            quantity: warehouseItem.secondWarehouseAmt,
          });
        }

        if (warehouseItem.thirdWarehouse !== null) {
          result.destinations.push({
            to_warehouse_id: warehouseItem.thirdWarehouse.id,
            quantity: warehouseItem.thirdWarehouseAmt,
          });
        }

        results.push(result);
      }
    }
    return results;
  };

  const handleCreateStockTransfer = async () => {
    if (selectedWarehouse !== null) {
      const payload = {
        status,
        transaction_date: transactionDate,
        rr_transfer: rrTransfer,
        remarks,
        supplier_id: 1,
        from_warehouse_id: selectedWarehouse.id,
        stock_transfer_details: createStockTransferDetails(),
      };

      try {
        await axiosInstance.post("/api/stock-transfers/", payload);
        toast.success("Save successful!");
        resetForm();
        setOpen(false);
        // Handle the response, update state, etc.
      } catch (error: any) {
        toast.error(`Error: ${error?.response?.data?.detail[0]?.msg}`);
      }
    }
  };

  const resetForm = (): void => {
    setStatus("unposted");
    setTransactionDate(currentDate);
    setRemarks("");
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (openCreate) await handleCreateStockTransfer();
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
      <STFormTable
        selectedWarehouse={selectedWarehouse}
        selectedRow={selectedRow}
        warehouses={warehouses}
        selectedWarehouseItem={selectedWarehouseItem}
        setSelectedWarehouseItem={setSelectedWarehouseItem}
        warehouseItems={warehouseItems}
        setWarehouseItems={setWarehouseItems}
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
