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
  PaginatedCPO,
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
  getCPOsByCustomer: (customer_id: number | undefined) => void;
  setCPOItems: Dispatch<SetStateAction<CPOItemFE[]>>;
}

export interface CPOItemFE {
  id: number; // The ID of the Customer Purchase Order (CPO)
  name: string; // The name of the item
  volume: number; // The total volume of the item
  alloc_qty: number; // Allocated quantity (volume - unserved_cpo)
  item_id: number;

  // Allocations to warehouses
  warehouse_1: Warehouse | null; // Name or identifier for Warehouse 1
  warehouse_1_qty: string | undefined; // Quantity allocated to Warehouse 1
  warehouse_2: Warehouse | null; // Name or identifier for Warehouse 2
  warehouse_2_qty: string | undefined; // Quantity allocated to Warehouse 2
  warehouse_3: Warehouse | null; // Name or identifier for Warehouse 3
  warehouse_3_qty: string | undefined; // Quantity allocated to Warehouse 3
}

export interface AllocFormTableProps {
  selectedRow: Alloc | undefined;
  warehouses: PaginatedWarehouse;
  selectedCustomer: Customer | null;
  CPOItems: CPOItemFE[];
  setCPOItems: Dispatch<SetStateAction<CPOItemFE[]>>;
  openCreate: boolean;
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
