import { useState } from "react";
import CDPForm from "../../components/CDP/CDPForm";
import ViewCDP from "../../components/CDP/ViewCDP";
import type { CDP } from "../../interface";

const DeliveryPlanningMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CDP | undefined>();

  return (
    <div>
      {openCreate && (
        <CDPForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Delivery Planning"
        />
      )}

      {openEdit && (
        <CDPForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Delivery Planning"
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
