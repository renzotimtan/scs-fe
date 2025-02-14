import { useState } from "react";
import ViewCDP from "../../components/CDP/ViewCDP";
import type { CDP } from "../../interface";

const DeliveryPlanningMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CDP | undefined>();

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
          title="Edit Delivery Receipt"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewCDP
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default DeliveryPlanningMenu;
