import type {
  PaginatedRR,
  PaginatedWarehouse,
  ReceivingReport,
  Warehouse,
  WarehouseItem,
  StockTransfer,
  Customer,
  PaginatedCustomers,
  Alloc,
} from "../../interface";
import type { Dispatch, SetStateAction } from "react";

export interface AllocFormDetailsProps {
  openEdit: boolean;
  selectedRow: any;
  status: string;
  setStatus: (status: string) => void;
  transactionDate: string;
  setTransactionDate: (transactionDate: string) => void;
  remarks: string;
  setRemarks: (remarks: string) => void;
  warehouses: PaginatedWarehouse;
  customers: PaginatedCustomers;
  selectedCustomer: Customer | null;
  setSelectedCustomer: Dispatch<SetStateAction<Customer | null>>;
}

export interface AllocFormTableProps {
  selectedRow: Alloc | undefined;
  warehouses: PaginatedWarehouse;
  selectedCustomer: Customer | null;
}

interface Destinations {
  to_warehouse_id: number;
  quantity: number;
}

export interface AllocFormPayload {
  warehouse_id: number;
  item_id: number;
  product_name: string;
  stock_code: string;
  destinations: Destinations[];
}
