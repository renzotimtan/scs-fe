import { useState } from "react";
import PurchaseOrderForm from "../../components/PurchaseOrder/PurchaseOrderForm";
import ViewPurchaseOrder from "../../components/PurchaseOrder/ViewPurchaseOrder";
export interface PurchaseOrder {
  id: number;
  purchase_order_number: number;
  supplier_id: number;
  status: string;
  transaction_date: string;
  supplier_discount: number;
  transaction_discount: number;
  currency_used: string;
  peso_rate: number;
  net_amount: number;
  fob_total: number;
  landed_total: number;
  reference_number: string;
  remarks: string;
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
        />
      )}

      {openEdit && (
        <PurchaseOrderForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
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
