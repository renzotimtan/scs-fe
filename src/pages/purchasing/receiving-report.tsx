import { useState } from "react";
import ReceivingReportForm from "../../components/ReceivingReport/ReceivingReportForm";
import ViewReceivingReport from "../../components/ReceivingReport/ViewReceivingReport";
import type { ReceivingReport } from "../../interface";

const ReceivingReportMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<ReceivingReport | undefined>();

  return (
    <div>
      {openCreate && (
        <ReceivingReportForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Receiving Report"
        />
      )}

      {openEdit && (
        <ReceivingReportForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          title="Edit Receiving Report"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewReceivingReport
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default ReceivingReportMenu;
