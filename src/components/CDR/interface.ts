import type {
  PaginatedCustomers,
  Customer,
  CDP,
  CPO,
  CDR,
} from "../../interface";
import type { Dispatch, SetStateAction } from "react";
import { type User } from "../../pages/Login";

export interface CDRFormDetailsProps {
  openEdit: boolean;
  selectedRow: CDR | undefined;
  customers: PaginatedCustomers;
  formattedAllocs: AllocItemsFE[];
  setFormattedAllocs: Dispatch<SetStateAction<AllocItemsFE[]>>;

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
  totalItems: number;
  amountDiscount: number;
  setAmountDiscount: Dispatch<SetStateAction<number>>;
  selectedDP: CDP | null;
  setSelectedDP: Dispatch<SetStateAction<CDP | null>>;
}

export interface UnplannedAlloc {
  id: number;
  status: string;
  customer_id: number;
  remarks: string;
  transaction_date: string;
  customer: Customer;
  allocation_items: Array<{
    id: number;
    customer_purchase_order_id: number;
    item_id: number;
    total_available: number;
    created_by: number;
    date_created: string;
    customer_purchase_order: CPO;
  }>;
  creator: User;
  date_created: string;
}

export interface AllocItemsFE {
  id: number;
  alloc_item_id: number;
  stock_code: string;
  name: string; // The name of the item
  cpo_id: number;
  alloc_qty: number;
  dp_qty: string | undefined;
  price: number;
  gross_amount: number;
  net_amount: number;

  cpo_item_volume: number;
  cpo_item_unserved: number;

  customer_discount_1: string;
  customer_discount_2: string;
  customer_discount_3: string;

  transaction_discount_1: string;
  transaction_discount_2: string;
  transaction_discount_3: string;
}

export interface NewPriceInstance {
  id: number;
  newPrice: number;
}

export interface CDRFormTableProps {
  selectedRow: CDR | undefined;
  formattedAllocs: AllocItemsFE[];
  setFormattedAllocs: Dispatch<SetStateAction<AllocItemsFE[]>>;
  totalNet: number;
  totalGross: number;
  totalItems: number;
  openEdit: boolean;
  isEditDisabled: boolean;
  selectedDP: CDP | null;
  setSelectedDP: Dispatch<SetStateAction<CDP | null>>;
}
