import STFormDetails from "./STForm/STFormDetails";
import STFormTable from "./STForm/STFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useMemo, useState } from "react";
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
  Supplier,
  PaginatedSuppliers,
} from "../../interface";
import { convertToQueryParams } from "../../helper";
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
  const [suppliers, setSuppliers] = useState<PaginatedSuppliers>({
    total: 0,
    items: [],
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
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

    // Fetch suppliers
    axiosInstance
      .get<PaginatedSuppliers>("/api/suppliers/")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error:", error));

    // Fetch RR
    axiosInstance
      .get<PaginatedRR>("/api/receiving-reports/?status=posted")
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

  const filteredReceivingReports = useMemo(() => {
    if (selectedSupplier != null) {
      const filteredItems = receivingReports.items.filter(
        (rr) => rr.supplier_id === selectedSupplier.supplier_id,
      );
      return {
        total: filteredItems.length,
        items: filteredItems,
      };
    }
    return receivingReports;
  }, [selectedSupplier, receivingReports]);

  useEffect(() => {
    // Fill in fields for Edit
    if (selectedRow) {
      setStatus(selectedRow?.status ?? "unposted");
      setTransactionDate(selectedRow?.transaction_date ?? currentDate);
      setRemarks(selectedRow?.remarks ?? "");
      setRRTransfer(selectedRow.rr_transfer ? "yes" : "no");

      axiosInstance
        .get<Supplier>(`/api/suppliers/${selectedRow.supplier_id}`)
        .then((response) => {
          setSelectedSupplier(response.data);
        })
        .catch((error) => console.error("Error:", error));

      axiosInstance
        .get<Warehouse>(`/api/warehouses/${selectedRow.from_warehouse_id}`)
        .then((response) => {
          setSelectedWarehouse(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedRow]);

  useEffect(() => {
    if (selectedRow && selectedRow.rr_transfer && warehouseItems.length > 0) {
      axiosInstance
        .get<ReceivingReport>(`/api/receiving-reports/${selectedRow.rr_id}`)
        .then((response) => {
          const selectedReceivingReport = response.data;
          handleRRNumChange(selectedReceivingReport);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedRow, warehouseItems]);

  useEffect(() => {
    if (selectedWarehouse && selectedSupplier) {
      // Fetch items for the selected warehouse and supplier
      const params: {
        warehouse_id: number;
        supplier_id: number;
      } = {
        warehouse_id: selectedWarehouse.id,
        supplier_id: selectedSupplier?.supplier_id,
      };
      axiosInstance
        .get(`/api/warehouse_items?${convertToQueryParams(params)}`)
        .then((response) => {
          const tempWarehouseItems = response.data.items;
          setWarehouseItems(tempWarehouseItems);

          if (rrTransfer === "no") {
            fetchMultipleItems(
              tempWarehouseItems.map(
                (warehouseItem: WarehouseItem) => warehouseItem.item_id,
              ),
              tempWarehouseItems,
            );
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedWarehouse, selectedSupplier, rrTransfer]);

  const handleRRNumChange = (newValue: ReceivingReport) => {
    setSelectedRR(newValue);

    const addedPOItems: any = [];

    newValue?.sdrs.forEach((SDR) => {
      SDR.purchase_orders.forEach((PO) => {
        PO.items.forEach((POItem) => {
          if (!addedPOItems.includes(POItem.item_id)) {
            addedPOItems.push(POItem.item_id);
          }
        });
      });
    });

    fetchMultipleItems(addedPOItems);
  };

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

  const fetchMultipleItems = async (
    POItems: any,
    items: WarehouseItem[] = warehouseItems,
  ) => {
    if (POItems.length > 0) {
      const foundWarehouseItems = await Promise.all(
        items
          .filter((warehouseItem) => {
            return POItems.includes(warehouseItem.item_id);
          })
          .map(async (warehouseItem) => {
            if (selectedRow !== null && selectedRow !== undefined) {
              const foundDetails = selectedRow.stock_transfer_details.find(
                (std) => std.stock_code === warehouseItem.item.stock_code,
              );
              const result: WarehouseItem = {
                ...warehouseItem,
                firstWarehouse: null,
                firstWarehouseAmt: 0,
                secondWarehouse: null,
                secondWarehouseAmt: 0,
                thirdWarehouse: null,
                thirdWarehouseAmt: 0,
              };

              if (foundDetails) {
                if (foundDetails.destinations.length >= 1) {
                  result.firstWarehouse = warehouses.items.find(
                    (warehouse) =>
                      warehouse.id ===
                      foundDetails.destinations[0].to_warehouse_id,
                  );
                  result.firstWarehouseAmt =
                    foundDetails.destinations[0].quantity;
                }

                if (foundDetails.destinations.length >= 2) {
                  result.secondWarehouse = warehouses.items.find(
                    (warehouse) =>
                      warehouse.id ===
                      foundDetails.destinations[1].to_warehouse_id,
                  );

                  result.secondWarehouseAmt =
                    foundDetails.destinations[1].quantity;
                }

                if (foundDetails.destinations.length >= 3) {
                  result.thirdWarehouse = warehouses.items.find(
                    (warehouse) =>
                      warehouse.id ===
                      foundDetails.destinations[2].to_warehouse_id,
                  );

                  result.thirdWarehouseAmt =
                    foundDetails.destinations[2].quantity;
                }
              }

              return result;
            } else {
              return {
                ...warehouseItem,
                firstWarehouse: null,
                firstWarehouseAmt: 0,
                secondWarehouse: null,
                secondWarehouseAmt: 0,
                thirdWarehouse: null,
                thirdWarehouseAmt: 0,
              };
            }
          }),
      );

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
        supplier_id: selectedSupplier?.supplier_id ?? null,
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

  const handleEditStockTransfer = async () => {
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
        await axiosInstance.put(
          `api/stock-transfers/${selectedRow?.id}`,
          payload,
        );
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
        if (openEdit) await handleEditStockTransfer();
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
        receivingReports={filteredReceivingReports}
        selectedRR={selectedRR}
        setSelectedRR={setSelectedRR}
        suppliers={suppliers}
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        setSelectedWarehouseItems={setSelectedWarehouseItems}
        fetchMultipleItems={fetchMultipleItems}
        warehouseItems={warehouseItems}
        handleRRNumChange={handleRRNumChange}
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
        selectedSupplier={selectedSupplier}
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
