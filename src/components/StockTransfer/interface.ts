import type {
  PaginatedRR,
  PaginatedWarehouse,
  ReceivingReport,
  Warehouse,
  WarehouseItem,
  StockTransfer,
  Supplier,
  PaginatedSuppliers,
} from "../../interface";
import type { Dispatch, SetStateAction } from "react";

export interface STFormDetailsProps {
  openEdit: boolean;
  selectedRow: any;
  status: string;
  setStatus: (status: string) => void;
  transactionDate: string;
  setTransactionDate: (transactionDate: string) => void;
  remarks: string;
  setRemarks: (remarks: string) => void;
  rrTransfer: string;
  setRRTransfer: (rrTransfer: string) => void;
  warehouses: PaginatedWarehouse;
  selectedWarehouse: Warehouse | null;
  setSelectedWarehouse: (warehouse: Warehouse | null) => void;
  receivingReports: PaginatedRR;
  selectedRR: ReceivingReport | null;
  setSelectedRR: (receivingReport: ReceivingReport | null) => void;
  suppliers: PaginatedSuppliers;
  selectedSupplier: Supplier | null;
  setSelectedSupplier: Dispatch<SetStateAction<Supplier | null>>;
  setSelectedWarehouseItems: Dispatch<SetStateAction<WarehouseItem[]>>;
  warehouseItems: WarehouseItem[];
  fetchMultipleItems: (POItems: any) => void;
}

export interface STFormTableProps {
  selectedWarehouse: Warehouse | null;
  selectedRow: StockTransfer | undefined;
  warehouses: PaginatedWarehouse;
  selectedWarehouseItems: any;
  setSelectedWarehouseItems: (warehouseItems: any) => void;
  warehouseItems: WarehouseItem[];
  setWarehouseItems: (warehouseItems: WarehouseItem[]) => void;
  fetchSelectedItem: (value: number, index: number) => void;
  selectedSupplier: Supplier | null;
}

interface Destinations {
  to_warehouse_id: number;
  quantity: number;
}

export interface STFormPayload {
  warehouse_id: number;
  item_id: number;
  product_name: string;
  stock_code: string;
  destinations: Destinations[];
}
