import type {
  PurchaseOrder,
  Item,
  DeliveryReceipt,
  PaginatedCustomers,
  Customer,
  CDP,
  Alloc,
  Warehouse,
} from "../../interface";
import type { Dispatch, SetStateAction } from "react";

export interface CDPFormDetailsProps {
  openEdit: boolean;
  selectedRow: CDP | undefined;
  customers: PaginatedCustomers;
  selectedAllocs: Alloc[];
  setSelectedAllocs: Dispatch<SetStateAction<Alloc[]>>;

  // Fields
  selectedCustomer: Customer | null;
  setSelectedCustomer: Dispatch<SetStateAction<Customer | null>>;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
  transactionDate: string;
  setTransactionDate: Dispatch<SetStateAction<string>>;
  remarks: string;
  setRemarks: Dispatch<SetStateAction<string>>;
  referenceNumber: string;
  setReferenceNumber: Dispatch<SetStateAction<string>>;
  isEditDisabled: boolean;
  totalNet: number;
  totalGross: number;

export interface AllocItemsFE {
  id: number;
  stock_code: string;
  name: string; // The name of the item

  price: number;
  gross_amount: number;
  net_amount: number;

  // Allocations to warehouses
  alloc_qty_1: number | null; // Allocated quantity
  warehouse_1: string | null; // Name or identifier for Warehouse 1
  warehouse_1_qty: string | undefined; // Quantity allocated to Warehouse 1

  alloc_qty_2: number | null; // Allocated quantity
  warehouse_2: string | null; // Name or identifier for Warehouse 2
  warehouse_2_qty: string | undefined; // Quantity allocated to Warehouse 2

  alloc_qty_3: number | null; // Allocated quantity
  warehouse_3: string | null; // Name or identifier for Warehouse 3
  warehouse_3_qty: string | undefined; // Quantity allocated to Warehouse 3
}

export interface NewPriceInstance {
  id: number;
  newPrice: number;
}

export interface POFormTableProps {
  selectedPOs: PurchaseOrder[];
  setSelectedPOs: Dispatch<SetStateAction<PurchaseOrder[]>>;
}

export interface CDPFormTableProps {
  selectedRow: CDP | undefined;
  formattedAllocs: AllocItemsFE[];
  setFormattedAllocs: Dispatch<SetStateAction<AllocItemsFE[]>>;
  selectedAllocs: Alloc[];
  setSelectedAllocs: Dispatch<SetStateAction<Alloc[]>>;
  totalNet: number;
  totalGross: number;
  totalItems: number;
  setTotalItems: Dispatch<SetStateAction<number>>;
  openEdit: boolean;
  isEditDisabled: boolean;
}

export interface POPayload {
  status: string;
  transaction_date: string;
  supplier_id: number;
  fob_total: number;
  currency_used: string;
  supplier_discount_1: string;
  supplier_discount_2: string;
  supplier_discount_3: string;
  transaction_discount_1: string;
  transaction_discount_2: string;
  transaction_discount_3: string;
  peso_rate: number;
  net_amount: number;
  reference_number: string;
  landed_total: number;
  remarks: string;
  created_by?: number;
  modified_by?: number;
  items: Item[];
}

export interface POItemValues {
  item_id: number;
  volume: number;
  unserved_spo: number;
  price: number;
  total_price: number;
}
