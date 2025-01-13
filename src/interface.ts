import type { Expense } from "./components/ReceivingReport/interface";
import type { User } from "./pages/Login";
export interface Item {
  id: number;
  stock_code: string;
  name: string;
  supplier_id?: number;
  suppliers?: (Supplier | null)[];
  status: string;
  category: string;
  brand: string;
  acquisition_cost?: number;
  net_cost_before_tax?: number;
  currency: string;
  last_sale_price?: number;
  srp?: number;
  rate?: number;
  total_on_stock: number;
  total_available: number;
  total_allocated: number;
  total_purchased: number;
  created_by: number;
  modified_by: number;
  date_created: string;
  date_modified: string;
  creator?: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  modifier?: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };

  // Fields for PO Functionality only
  volume?: any;
  price?: any;
  on_stock?: number;
  in_transit?: number;
  allocated?: number;
}

export interface ViewStockHistory {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  row?: Item;
}

export interface StockHistory {
  transaction_type: string;
  stock_code: string;
  stock_description: string;
  transaction_date: string;
  transaction_number: number;
  quantity_in: number;
  quantity_out: number;
  price: number;
  amount: number;
}

export interface DeleteModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  onDelete: () => Promise<void>;
}

export interface ItemsModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  row?: Item;
  onSave: (newItem: Item) => Promise<void>;
}

export interface Supplier {
  supplier_id: number;
  code: string;
  name: string;
  building_address: string;
  street_address: string;
  city: string;
  province: string;
  country: string;
  zip_code: string;
  contact_person: string;
  contact_number: string;
  email: string;
  fax_number: string;
  currency: string;
  discount_rate?: number;
  supplier_balance?: number;
  created_by: number;
  modified_by: number;
  date_created: string;
  date_modified: string;
  notes: string;
  creator?: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  modifier?: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
}

export interface Customer {
  customer_id: number;
  code: string;
  name: string;
  building_address: string;
  street_address: string;
  city: string;
  province: string;
  country: string;
  zip_code: string;
  contact_person: string;
  contact_number: string;
  email: string;
  fax_number: string;
  currency: string;
  discount_rate?: number;
  customer_balance?: number;
  created_by: number;
  modified_by: number;
  date_created: string;
  date_modified: string;
  notes: string;
  creator?: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  modifier?: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
}

export interface SuppliersModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  row?: Supplier;
  onSave: (newSupplier: Supplier) => Promise<void>;
}

export interface CustomersModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  row?: Customer;
  onSave: (newCustomer: Customer) => Promise<void>;
}

export interface PaginatedSuppliers {
  total: number;
  items: Supplier[];
}

export interface PaginatedCustomers{
  total: number;
  items: Customer[];
}

export interface PaginatedItems {
  total: number;
  items: Item[];
}

export interface PaginatedWarehouse {
  total: number;
  items: Warehouse[];
}

export interface PaginatedWarehouseItems {
  total: number;
  items: WarehouseItem[];
}

export interface PaginatedAggregatedWarehouseItems {
  total: number;
  items: AggregatedWarehouseItem[];
}

export interface PaginatedPO {
  total: number;
  items: PurchaseOrder[];
}

export interface PaginatedCPO {
  total: number;
  items: CPO[];
}


export interface PaginatedSDR {
  total: number;
  items: DeliveryReceipt[];
}

export interface PaginatedRR {
  total: number;
  items: ReceivingReport[];
}

export interface PaginatedST {
  total: number;
  items: StockTransfer[];
}

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  search_term?: string;
  status?: string;
  unassigned_to_rr?: boolean;
}

export interface Warehouse {
  id: number;
  code: string;
  name: string;
  type: string;
  creator?: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  modifier?: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  created_by: number;
  modified_by: number;
  date_created: string;
  date_modified: string;
}

export interface WarehousesModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  row?: Warehouse;
  onSave: (newWarehouse: Warehouse) => Promise<void>;
}

export interface ViewWHModalProps {
  open: boolean;
  setOpen: (isOpen: boolean) => void;
  row?: any;
  type: string;
}

export interface WarehouseItem {
  warehouse_id: number;
  item_id: number;
  on_stock: number;
  available: number;
  allocated: number;
  purchased: number;
  sold: number;
  warehouse: Warehouse;
  item: Item;
  created_by: string;
  modified_by: string;
  date_created: string;
  date_modified: string;

  firstWarehouse?: any;
  firstWarehouseAmt?: number | null;
  secondWarehouse?: any;
  secondWarehouseAmt?: number | null;
  thirdWarehouse?: any;
  thirdWarehouseAmt?: number | null;

  // Hack fix
  id?: number | null;
}

export interface AggregatedWarehouseItem {
  warehouse_id: number;
  warehouse_name: string;
  stock_code: string;
  item_name: string;
  total_on_stock: number;
  total_available: number;
  total_allocated: number;
  total_purchased: number;
  total_sold: number;
  total_reorder_level: number;
  total_unserved_cpo: number;
  total_unserved_spo: number;
}

export interface PurchaseOrder {
  id: number;
  supplier_id: number;
  status: string;
  transaction_date: string;
  supplier_discount_1: string;
  transaction_discount_1: string;
  supplier_discount_2: string;
  transaction_discount_2: string;
  supplier_discount_3: string;
  transaction_discount_3: string;
  currency_used: string;
  peso_rate: number;
  net_amount: number;
  fob_total: number;
  landed_total: number;
  reference_number: string;
  remarks: string;
  supplier: Supplier;
  created_by: number;
  modified_by: number;
  creator: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_created: string;
  modifier: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_modified: string;
  items: POItems[];
}

export interface PurchaseOrderFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: PurchaseOrder;
  title: string;
}

export interface CPO {
  id: number;
  customer_id: number;
  status: string;
  price_level: number;
  transaction_date: string;
  customer_discount_1: string;
  transaction_discount_1: string;
  customer_discount_2: string;
  transaction_discount_2: string;
  customer_discount_3: string;
  transaction_discount_3: string;
  net_total: number;
  gross_total: number;
  reference_number: string;
  remarks: string;
  customer: Customer;
  created_by: number;
  modified_by: number;
  creator: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_created: string;
  modifier: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_modified: string;
  items: CPOItems[];
}

export interface CPOFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: CPO;
  title: string;
}

export interface SDRFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: DeliveryReceipt;
  title: string;
}

export interface RRFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: ReceivingReport;
  title: string;
}

export interface STFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: StockTransfer;
  title: string;
}

export interface ViewPurchaseOrderProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: PurchaseOrder | undefined;
  setSelectedRow: (purchaseOrder: PurchaseOrder) => void;
}

export interface ViewCPOProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: CPO | undefined;
  setSelectedRow: (cpo: CPO) => void;
}
export interface ViewDeliveryReceiptProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: DeliveryReceipt | undefined;
  setSelectedRow: (deliveryReceipt: DeliveryReceipt) => void;
}

export interface ViewReceivingReportProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: ReceivingReport | undefined;
  setSelectedRow: (receivingReport: ReceivingReport) => void;
}

export interface ViewStockTransferProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: StockTransfer | undefined;
  setSelectedRow: (stockTransfer: StockTransfer) => void;
}

export interface CPOItems {
  // Discrepancy between item_id, id
  item_id: number;
  id: number;

  customer_purchase_order_id: number;
  volume: number;
  price: number;
  total_price: number;
  on_stock: number;
  in_transit: number;
  allocated: number;
  unserved_spo: number;
  item: Item;

  temp_in_transit: number;
  temp_on_stock: number;
  temp_allocated: number;
}

export interface POItems {
  // Discrepancy between item_id, id
  item_id: number;
  id: number;

  purchase_order_id: number;
  volume: number;
  price: number;
  total_price: number;
  on_stock: number;
  in_transit: number;
  allocated: number;
  unserved_spo: number;
  item: Item;

  temp_in_transit: number;
  temp_on_stock: number;
  temp_allocated: number;
}

export interface DeliveryReceipt {
  id: number;
  supplier_id: number;
  transaction_date: string;
  status: string;
  discount_amount: number;
  net_amount: number;
  fob_total: number;
  landed_total: number;
  reference_number: string;
  remarks: string;
  supplier: Supplier;
  created_by: number;
  modified_by: number;
  creator: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_created: string;
  modifier: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_modified: string;
  purchase_orders: PurchaseOrder[];
}

export interface DeliveryReceiptFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: PurchaseOrder;
  setSelectedRow?: (purchaseOrder: PurchaseOrder) => void;
  title: string;
}

export interface ReceivingReport {
  id: number;
  status: string;
  transaction_date: string;
  supplier_id: number;
  currency: string;
  rate: number;
  total_expense: number;
  reference_number: string;
  pct_net_cost: number;
  remarks: string;
  fob_total: number;
  net_amount: number;
  landed_total: number;
  sdrs: DeliveryReceipt[];
  expenses: Expense[];
  creator: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_created: string;
  modifier: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_modified: string;
}

interface STDest {
  id: number;
  quantity: number;
  to_warehouse_id: number;
}

interface StockTransferDetail {
  id: number;
  stock_transfer_id: number;
  warehouse_id: number;
  item_id: number;
  product_name: string;
  stock_code: string;
  total_qty: number;
  to_warehouse_id: number;
  rr_balance_quantity: number;
  on_stock: number;
  available: number;
  unit_code: string;
  created_by: number;
  date_created: string;
  modified_by: number;
  date_modified: string;
  creator: User;
  modifier: User;
  destinations: STDest[];
}

export interface StockTransfer {
  id: number;
  status: string;
  transaction_date: string;
  rr_transfer: boolean;
  remarks: string;
  rr_id: number;
  supplier_id: number;
  from_warehouse_id: number;
  created_by: number;
  date_created: string;
  modified_by: number;
  date_modified: string;
  stock_transfer_details: StockTransferDetail[];
  creator: User;
  modifier: User;
}
