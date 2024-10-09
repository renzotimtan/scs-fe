import { useState } from "react";
import AllocForm from "../../components/Allocation/AllocForm";
import ViewAlloc from "../../components/Allocation/ViewAlloc";

const AllocationMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState();

  return (
    <div>
      {openCreate && (
        <AllocForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Allocation"
        />
      )}

      {openEdit && (
        <AllocForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Allocation"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewAlloc
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default AllocationMenu;
