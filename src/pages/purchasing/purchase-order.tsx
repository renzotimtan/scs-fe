import { useState } from "react";
import PurchaseOrderForm from "../../components/PurchaseOrder/PurchaseOrderForm";
import ViewPurchaseOrder from "../../components/PurchaseOrder/ViewPurchaseOrder";

const PurchaseOrder = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);

  return (
    <div>
      {openCreate ? (
        <PurchaseOrderForm setOpenCreate={setOpenCreate} />
      ) : (
        <ViewPurchaseOrder setOpenCreate={setOpenCreate} />
      )}
    </div>
  );
};

export default PurchaseOrder;
