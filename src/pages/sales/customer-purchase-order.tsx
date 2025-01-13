import { useState } from "react";
import CPOForm from "../../components/CPO/CPOForm";
import ViewCPO from "../../components/CPO/ViewCPO";
import type { CPO } from "../../interface";

const CPOMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<CPO | undefined>();

  return (
    <div>
      {openCreate && (
        <CPOForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Customer Purchase Order"
        />
      )}

      {openEdit && (
        <CPOForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Customer Purchase Order"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewCPO
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default CPOMenu;
