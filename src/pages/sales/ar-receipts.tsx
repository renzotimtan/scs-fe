import { useState } from "react";
import ViewAR from "../../components/AR/ViewAR";
import type { AR } from "../../interface";
import ARForm from "../../components/AR/ARForm";

const AccountsReceivableMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<AR | undefined>();

  return (
    <div>
      {openCreate && (
        <ARForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Customer Return"
        />
      )}

      {openEdit && (
        <ARForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Customer Return"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewAR
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default AccountsReceivableMenu;
