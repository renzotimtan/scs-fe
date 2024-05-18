import type {
  PurchaseOrder,
  Supplier,
  PaginatedSuppliers,
  Item,
} from "../../interface";
import type { Dispatch, SetStateAction } from "react";

export interface SDRFormDetailsProps {
  openEdit: boolean;
  selectedRow: PurchaseOrder | undefined;
  suppliers: PaginatedSuppliers;
  setSelectedPOs: Dispatch<SetStateAction<PurchaseOrder[]>>;

  // Fields
  selectedSupplier: Supplier | null;
  setSelectedSupplier: Dispatch<SetStateAction<Supplier | null>>;
  status: string;
  setStatus: Dispatch<SetStateAction<string>>;
  transactionDate: string;
  setTransactionDate: Dispatch<SetStateAction<string>>;
  remarks: string;
  setRemarks: Dispatch<SetStateAction<string>>;
  referenceNumber: string;
  setReferenceNumber: Dispatch<SetStateAction<string>>;

  fobTotal: number;
  netAmount: number;
  landedTotal: number;
}

export interface NewPriceInstance {
  id: number;
  newPrice: number;
}

export interface POFormTableProps {
  // items: Item[];
  selectedPOs: PurchaseOrder[];
  // setSelectedPOItems: Dispatch<SetStateAction<POItems[]>>;
  // indexOfModal: number;
  // setIndexOfModal: Dispatch<SetStateAction<number>>;
  // newPrices: NewPriceInstance[];
  // setNewPrices: Dispatch<SetStateAction<NewPriceInstance[]>>;
  // isConfirmOpen: boolean;
  // setIsConfirmOpen: Dispatch<SetStateAction<boolean>>;
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
