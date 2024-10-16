import STFormDetails from "./STForm/AllocFormDetails";
import STFormTable from "./STForm/AllocFormTable";
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
  Item,
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

  const [selectedWarehouseItems, setSelectedWarehouseItems] = useState<any>(
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
      setRRTransfer(selectedRow.rr_transfer ? "yes" : "no");

      const selectedReceivingReport = receivingReports.items.find(
        (rr: ReceivingReport) => rr.id == selectedRow.rr_id,
      );

      if (selectedReceivingReport !== undefined) {
        setSelectedRR(selectedReceivingReport);
      }

      const selectedWarehouse = warehouses.items.find(
        (warehouse: Warehouse) => warehouse.id == selectedRow.from_warehouse_id,
      );

      if (selectedWarehouse !== undefined) {
        setSelectedWarehouse(selectedWarehouse);
      }
    }
  }, [selectedRow, warehouses, receivingReports]);

  useEffect(() => {
    const addedPOItems: any = [];

    selectedRR?.sdrs.forEach((SDR) => {
      SDR.purchase_orders.forEach((PO) => {
        PO.items.forEach((POItem) => {
          if (!addedPOItems.includes(POItem.item_id)) {
            addedPOItems.push(POItem.item_id);
          }
        });
      });
    });

    fetchMultipleItems(addedPOItems);
  }, [selectedRR]);

  const fetchSelectedItem = (value: number, index: number): void => {
    if (value !== undefined) {
      const foundWarehouseItem = warehouseItems.find(
        (warehouseItem) => warehouseItem.item_id === value,
      );

      if (foundWarehouseItem === undefined) return;

      for (const warehouseItem of selectedWarehouseItems) {
        if (warehouseItem?.item_id === foundWarehouseItem.item_id) {
          toast.error("Item has already been added");
          return;
        }
      }

      const warehouseItem: WarehouseItem = {
        ...foundWarehouseItem,
        firstWarehouse: null,
        firstWarehouseAmt: 0,
        secondWarehouse: null,
        secondWarehouseAmt: 0,
        thirdWarehouse: null,
        thirdWarehouseAmt: 0,
      };

      // We need to add the new item before the null item
      const newSelectedWarehouseItem = selectedWarehouseItems.filter(
        (selectedItem: Item) => selectedItem.id !== null,
      );
      newSelectedWarehouseItem[index] = warehouseItem;
      newSelectedWarehouseItem.push({ id: null });

      setSelectedWarehouseItems(newSelectedWarehouseItem);
    }
  };

  const fetchMultipleItems = (POItems: any) => {
    if (POItems.length > 0) {
      const foundWarehouseItems = warehouseItems
        .filter((warehouseItem) => {
          return POItems.includes(warehouseItem.item_id);
        })
        .map((warehouseItem) => {
          return {
            ...warehouseItem,
            firstWarehouse: null,
            firstWarehouseAmt: 0,
            secondWarehouse: null,
            secondWarehouseAmt: 0,
            thirdWarehouse: null,
            thirdWarehouseAmt: 0,
          };
        });

      if (foundWarehouseItems.length === 0) return;

      // We need to add the new item before the null item
      const newSelectedWarehouseItem = [];

      foundWarehouseItems.forEach((warehouseItem, index) => {
        newSelectedWarehouseItem[index] = warehouseItem;
      });

      newSelectedWarehouseItem.push({ id: null });
      setSelectedWarehouseItems(newSelectedWarehouseItem);
    }
  };

  const createStockTransferDetails = () => {
    const results = [];

    for (const warehouseItem of selectedWarehouseItems) {
      if (warehouseItem?.id !== null && selectedWarehouse !== null) {
        const result: STFormPayload = {
          warehouse_id: selectedWarehouse.id,
          item_id: warehouseItem.item_id,
          product_name: warehouseItem.item.name,
          stock_code: warehouseItem.item.stock_code,
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
        rr_id: selectedRR?.id ?? null,
        remarks,
        supplier_id: selectedRR?.supplier_id ?? null,
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
        console.log(error);
        toast.error(`Error: ${error?.response?.data?.detail}`);
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
        selectedWarehouseItems={selectedWarehouseItems}
        setSelectedWarehouseItems={setSelectedWarehouseItems}
        fetchSelectedItem={fetchSelectedItem}
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
