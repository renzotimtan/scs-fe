import type {
  PaginatedRR,
  PaginatedWarehouse,
  ReceivingReport,
  Warehouse,
  WarehouseItem,
  StockTransfer,
} from "../../interface";

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
}

interface Destinations {
  to_warehouse_id: number;
  quantity: number;
}

export interface STFormPayload {
  warehouse_id: number;
  item_id: number;
  product_name: string;
  unit_code: string;
  destinations: Destinations[];
}
