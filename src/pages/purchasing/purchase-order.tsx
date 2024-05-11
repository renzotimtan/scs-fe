import { useState } from "react";
import PurchaseOrderForm from "../../components/PurchaseOrder/PurchaseOrderForm";
import ViewPurchaseOrder from "../../components/PurchaseOrder/ViewPurchaseOrder";
import type { PurchaseOrder } from "../../interface";

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
