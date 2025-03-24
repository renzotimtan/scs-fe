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
  FetchedWarehouseItems,
} from "../../interface";
import { convertToQueryParams } from "../../helper";
import { STFormPayload, WarehouseItemsFE } from "./interface";

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
  const [warehouseItems, setWarehouseItems] = useState<WarehouseItemsFE[]>([]);
  const [suppliers, setSuppliers] = useState<PaginatedSuppliers>({
    total: 0,
    items: [],
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const isEditDisabled =
    selectedRow !== undefined && selectedRow?.status !== "unposted";

  useEffect(() => {
    // Fetch warehouses
    axiosInstance
      .get<PaginatedWarehouse>("/api/warehouses/")
      .then((response) => {
        setWarehouses(response.data);

        const receivingArea = response.data.items.find(
          (warehouse) => warehouse.id === 1,
        );
        if (receivingArea) {
          setSelectedWarehouse(receivingArea);
        }
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

    // Fetch warehouse items
    if (openCreate) fetchWarehouseItems(1);
  }, []);

  useEffect(() => {
    // Fill in fields for Edit
    if (
      selectedRow !== null &&
      selectedRow !== undefined &&
      warehouses?.items?.length
    ) {
      setStatus(selectedRow?.status ?? "unposted");
      setTransactionDate(selectedRow?.transaction_date ?? currentDate);
      setRemarks(selectedRow?.remarks ?? "");
      setRRTransfer(selectedRow.rr_transfer ? "yes" : "no");

      if (selectedRow?.supplier_id) {
        axiosInstance
          .get<Supplier>(`/api/suppliers/${selectedRow.supplier_id}`)
          .then((response) => {
            setSelectedSupplier(response.data);
          })
          .catch((error) => console.error("Error:", error));
      }

      axiosInstance
        .get<Warehouse>(`/api/warehouses/${selectedRow.from_warehouse_id}`)
        .then((response) => {
          setSelectedWarehouse(response.data);
        })
        .catch((error) => console.error("Error:", error));

      if (selectedRow.rr_transfer) {
        axiosInstance
          .get<ReceivingReport>(`/api/receiving-reports/${selectedRow.rr_id}`)
          .then((response) => {
            setSelectedRR(response.data);
          })
          .catch((error) => console.error("Error:", error));
      }

      getWarehouseItemsOnView();
    }
  }, [selectedRow, warehouses]);

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

  const getItemsByRR = (rr: ReceivingReport) => {
    const itemIds: any = [];

    // get all item ids
    rr?.sdrs.forEach((SDR) => {
      SDR.purchase_orders.forEach((PO) => {
        PO.items.forEach((POItem) => {
          if (!itemIds.includes(POItem.item_id)) {
            itemIds.push(POItem.item_id);
          }
        });
      });
    });

    return itemIds;
  };

  const adjustOnStock = (warehouseItemFE: WarehouseItemsFE) => {
    const params = {
      warehouse_id: warehouseItemFE.warehouse_id,
      item_id: warehouseItemFE.item_id,
    };
    axiosInstance
      .get<FetchedWarehouseItems>(
        `/api/warehouse_items?${convertToQueryParams(params)}`,
      )
      .then((response): void => {
        const item = response.data.items[0];
        warehouseItemFE.on_stock = item?.on_stock ?? 0;
      })
      .catch((error) => console.error("Error:", error));
  };

  const fetchWarehouseItems = (
    warehouse_id: number,
    rr: ReceivingReport | null = null,
  ) => {
    const params: {
      warehouse_id: number;
    } = {
      warehouse_id,
    };
    axiosInstance
      .get<FetchedWarehouseItems>(
        `/api/warehouse_items?${convertToQueryParams(params)}`,
      )
      .then((response): void => {
        const tempWarehouseItems = response.data.items;
        let formattedItems = tempWarehouseItems.map((warehouseItem) => {
          return {
            id: `${warehouseItem.warehouse_id}-${warehouseItem.item_id}`,
            warehouse_id: warehouseItem.warehouse_id,
            item_id: warehouseItem.item_id,
            name: warehouseItem.item.name,
            stock_code: warehouseItem.item.stock_code,
            total_quantity: 0,
            on_stock: warehouseItem.on_stock,
            warehouse_1: null,
            warehouse_1_qty: undefined,
            warehouse_2: null,
            warehouse_2_qty: undefined,
            warehouse_3: null,
            warehouse_3_qty: undefined,
          };
        });

        if (rr !== null && rr !== undefined) {
          const item_ids = getItemsByRR(rr);
          formattedItems = formattedItems.filter((formattedItem) =>
            item_ids.includes(formattedItem.item_id),
          );
        }

        setWarehouseItems(formattedItems);
      })
      .catch((error) => console.error("Error:", error));
  };

  const getWarehouseItemsOnView = () => {
    if (selectedRow !== null && selectedRow !== undefined) {
      const formattedItems = selectedRow.stock_transfer_details.map((item) => {
        const result: WarehouseItemsFE = {
          id: `${item.warehouse_id}-${item.item_id}`,
          warehouse_id: item.warehouse_id,
          item_id: item.item_id,
          name: item.product_name,
          stock_code: item.stock_code,
          total_quantity: 0,
          on_stock: 0,
          warehouse_1: null,
          warehouse_1_qty: undefined,
          warehouse_2: null,
          warehouse_2_qty: undefined,
          warehouse_3: null,
          warehouse_3_qty: undefined,
        };

        if (!isEditDisabled) adjustOnStock(result);

        const destinations = item.destinations;

        if (destinations.length >= 1) {
          result.warehouse_1 =
            warehouses.items.find(
              (warehouse) => warehouse.id === destinations[0].to_warehouse_id,
            ) ?? null;
          result.total_quantity += destinations[0].quantity;
          result.warehouse_1_qty = String(destinations[0].quantity);
        }

        if (destinations.length >= 2) {
          result.warehouse_2 =
            warehouses.items.find(
              (warehouse) => warehouse.id === destinations[1].to_warehouse_id,
            ) ?? null;
          result.total_quantity += destinations[1].quantity;
          result.warehouse_2_qty = String(destinations[1].quantity);
        }

        if (destinations.length >= 3) {
          result.warehouse_3 =
            warehouses.items.find(
              (warehouse) => warehouse.id === destinations[2].to_warehouse_id,
            ) ?? null;
          result.total_quantity += destinations[2].quantity;
          result.warehouse_3_qty = String(destinations[2].quantity);
        }

        return result;
      });

      setWarehouseItems(formattedItems);
    }
  };

  const createStockTransferDetails = () => {
    const results = [];

    for (const item of warehouseItems) {
      if (selectedWarehouse !== null) {
        const result: STFormPayload = {
          warehouse_id: selectedWarehouse.id,
          item_id: item.item_id,
          product_name: item.name,
          stock_code: item.stock_code,
          destinations: [],
        };

        if (item.warehouse_1 !== null) {
          result.destinations.push({
            to_warehouse_id: item.warehouse_1.id,
            quantity: Number(item.warehouse_1_qty) || 0,
          });
        }

        if (item.warehouse_2 !== null) {
          result.destinations.push({
            to_warehouse_id: item.warehouse_2.id,
            quantity: Number(item.warehouse_2_qty) || 0,
          });
        }

        if (item.warehouse_3 !== null) {
          result.destinations.push({
            to_warehouse_id: item.warehouse_3.id,
            quantity: Number(item.warehouse_3_qty) || 0,
          });
        }

        // If there is no warehouse inputted
        if (result.destinations.length === 0) continue;

        results.push(result);
      }
    }
    return results;
  };

  const handleCreateStockTransfer = async () => {
    if (selectedWarehouse !== null) {

      const stock_transfer_details = createStockTransferDetails();
      if (stock_transfer_details.length === 0) {
        toast.error("Error: At least one warehouse and quantity input is required.")
      }

      const payload = {
        status,
        transaction_date: transactionDate,
        rr_transfer: rrTransfer,
        rr_id: selectedRR?.id ?? null,
        remarks,
        supplier_id: selectedSupplier?.supplier_id ?? null,
        from_warehouse_id: selectedWarehouse.id,
        stock_transfer_details,
      };

      try {
        await axiosInstance.post("/api/stock-transfers/", payload);
        toast.success("Save successful!");
        resetForm();
        setOpen(false);
        // Handle the response, update state, etc.
      } catch (error: any) {
        console.log(error);
        toast.error(
          `Error: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
        );
      }
    }
  };

  const handleEditStockTransfer = async () => {
    if (selectedWarehouse !== null) {

      const stock_transfer_details = createStockTransferDetails();
      if (stock_transfer_details.length === 0) {
        toast.error("Error: At least one warehouse and quantity input is required.")
      }

      const payload = {
        status,
        transaction_date: transactionDate,
        rr_transfer: rrTransfer,
        rr_id: selectedRR?.id ?? null,
        remarks,
        supplier_id: selectedRR?.supplier_id ?? null,
        from_warehouse_id: selectedWarehouse.id,
        stock_transfer_details,
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
        toast.error(
          `Error: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
        );
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
        fetchWarehouseItems={fetchWarehouseItems}
        setWarehouseItems={setWarehouseItems}
      />
      <STFormTable
        selectedRow={selectedRow}
        warehouses={warehouses}
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

export default StockTransferForm;
