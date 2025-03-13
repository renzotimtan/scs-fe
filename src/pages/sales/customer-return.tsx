import { useState } from "react";
import CRForm from "../../components/CR/CRForm";
import ViewCR from "../../components/CR/ViewCR";
import type { CR } from "../../interface";

const CustomerReturnMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CR | undefined>();

  return (
    <div>
      {openCreate && (
        <CRForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Customer Return"
        />
      )}

      {openEdit && (
        <CRForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Customer Return"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewCR
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default CustomerReturnMenu;
