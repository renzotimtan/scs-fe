import { useState } from "react";
import StockTransferForm from "../../components/StockTransfer/StockTransferForm";
import ViewStockTransfer from "../../components/StockTransfer/ViewStockTransfer";
import type { StockTransfer } from "../../interface";

const StockTransferMenu = (): JSX.Element => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRow, setSelectedRow] = useState<StockTransfer | undefined>();

  return (
    <div>
      {openCreate && (
        <StockTransferForm
          setOpen={setOpenCreate}
          openCreate={openCreate}
          openEdit={openEdit}
          title="Create Stock Transfer"
        />
      )}

      {openEdit && (
        <StockTransferForm
          setOpen={setOpenEdit}
          openCreate={openCreate}
          openEdit={openEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          title="Edit Stock Transfer"
        />
      )}

      {!openEdit && !openCreate && (
        <ViewStockTransfer
          setOpenCreate={setOpenCreate}
          setOpenEdit={setOpenEdit}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
        />
      )}
    </div>
  );
};

export default StockTransferMenu;
