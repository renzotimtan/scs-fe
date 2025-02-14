import { useState } from "react";
import DeallocForm from "../../components/Deallocation/DeallocForm";
import ViewDealloc from "../../components/Deallocation/ViewDealloc";
import type { Dealloc } from "../../interface";

const DeallocationMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Dealloc | undefined>();

  return (
    <div>
      {openCreate && (
        <DeallocForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Deallocation"
        />
      )}

      {openEdit && (
        <DeallocForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Deallocation"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewDealloc
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default DeallocationMenu;
