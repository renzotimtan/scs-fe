export interface Item {
  id: number;
  stock_code: string;
  name: string;
  supplier_id: number;
  status: string;
  category: string;
  brand: string;
  acquisition_cost: number;
  net_cost_before_tax: number;
  currency: string;
  last_sale_price: number;
  srp: number;
  rate: number;
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
  volume?: number;
  price?: number;
  on_stock?: number;
  available?: number;
  allocated?: number;
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
  discount_rate: number;
  supplier_balance: number;
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

export interface PaginatedSuppliers {
  total: number;
  items: Supplier[];
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

export interface PaginatedPO {
  total: number;
  items: PurchaseOrder[];
}

export interface PaginatedSDR {
  total: number;
  items: DeliveryReceipt[];
}

export interface PaginationQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  search_term?: string;
  status?: string;
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
  row?: Item | Warehouse;
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

export interface SDRFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: DeliveryReceipt;
  title: string;
}

export interface ViewPurchaseOrderProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: PurchaseOrder | undefined;
  setSelectedRow: (purchaseOrder: PurchaseOrder) => void;
}
export interface ViewDeliveryReceiptProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: DeliveryReceipt | undefined;
  setSelectedRow: (deliveryReceipt: DeliveryReceipt) => void;
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
  available: number;
  allocated: number;
  unserved_spo: number;
  item: Item;
}

export interface DeliveryReceipt {
  id: number;
  supplier_id: number;
  transaction_date: string;
  status: string;
  supplier_discount_amount: number;
  transaction_discount_amount: number;
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
  purchase_orders: POItems[];
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
  purchase_order_number: number;
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

export interface ViewReceivingReportProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: PurchaseOrder | undefined;
  setSelectedRow: (purchaseOrder: PurchaseOrder) => void;
}

export interface StockTransfer {
  id: number;
  purchase_order_number: number;
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
