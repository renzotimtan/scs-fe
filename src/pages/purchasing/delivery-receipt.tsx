import { useState } from "react";
import DeliveryReceiptForm from "../../components/DeliveryReceipt/DeliveryReceiptForm";
import ViewDeliveryReceipt from "../../components/DeliveryReceipt/ViewDeliveryReceipt";
import type { DeliveryReceipt } from "../../interface";

const DeliveryReceiptMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DeliveryReceipt | undefined>();

  return (
    <div>
      {openCreate && (
        <DeliveryReceiptForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Delivery Receipt"
        />
      )}

      {openEdit && (
        <DeliveryReceiptForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          title="Edit Delivery Receipt"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewDeliveryReceipt
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default DeliveryReceiptMenu;
