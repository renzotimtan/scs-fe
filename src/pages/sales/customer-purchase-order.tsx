import { useState } from "react";
import CustomerPurchaseOrderForm from "../../components/CustomerPurchaseOrder/CustomerPurchaseOrderForm";
import ViewCustomerPurchaseOrder from "../../components/CustomerPurchaseOrder/ViewCPurchaseOrder";
import type { PurchaseOrder } from "../../interface";

const CustomerPurchaseOrderMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PurchaseOrder | undefined>();

  return (
    <div>
      {openCreate && (
        <CustomerPurchaseOrderForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Customer Purchase Order"
        />
      )}

      {openEdit && (
        <CustomerPurchaseOrderForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Customer Purchase Order"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewCustomerPurchaseOrder
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default CustomerPurchaseOrderMenu;
