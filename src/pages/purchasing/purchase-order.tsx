import { useState } from "react";
import type { Supplier } from "../configuration/supplier";
import PurchaseOrderForm from "../../components/PurchaseOrder/PurchaseOrderForm";
import ViewPurchaseOrder from "../../components/PurchaseOrder/ViewPurchaseOrder";

export interface POItems {
  item_id: number;
  volume: number;
  price: number;
  total_amount: number;
}
export interface PurchaseOrder {
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

const PurchaseOrderMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PurchaseOrder | undefined>();

  return (
    <div>
      {openCreate && (
        <PurchaseOrderForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Purchase Order"
        />
      )}

      {openEdit && (
        <PurchaseOrderForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          title="Edit Purchase Order"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewPurchaseOrder
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default PurchaseOrderMenu;
