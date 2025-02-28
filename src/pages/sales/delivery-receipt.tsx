import { useState } from "react";
import CDRForm from "../../components/CDR/CDRForm";
import ViewCDR from "../../components/CDR/ViewCDR";
import type { CDR } from "../../interface";

const DeliveryPlanningMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CDR | undefined>();

  return (
    <div>
      {openCreate && (
        <CDRForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Delivery Receipt"
        />
      )}

      {openEdit && (
        <CDRForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Delivery Receipt"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewCDR
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
