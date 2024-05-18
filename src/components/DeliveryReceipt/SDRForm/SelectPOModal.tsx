import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Button, Box, ListItem, List, Checkbox } from "@mui/joy";
import type { PurchaseOrder } from "../../../interface";

const SelectPOModal = ({
  open,
  setOpen,
  unservedPOs,
  setSelectedPOs,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  unservedPOs: PurchaseOrder[];
  setSelectedPOs: Dispatch<SetStateAction<PurchaseOrder[]>>;
}): JSX.Element => {
  const [checkedPOs, setCheckedPOs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const options: Record<string, boolean> = {};
    unservedPOs.forEach((PO) => {
      options[PO.reference_number] = false;
    });
    setCheckedPOs(options);
  }, [unservedPOs]);

  const handleCheckboxChange = (referenceNumber: string): void => {
    setCheckedPOs((prev) => ({
      ...prev,
      [referenceNumber]: !prev[referenceNumber],
    }));
  };

  const selectCheckedPOs = (): void => {
    const selectedRefNos = Object.keys(checkedPOs).filter(
      (refNo) => checkedPOs[refNo],
    );

    const selectedPOs = unservedPOs.filter((PO) =>
      selectedRefNos.includes(PO.reference_number),
    );

    setSelectedPOs(selectedPOs);
    setOpen(false);
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        setOpen(false);
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <div>
        <Sheet
          variant="outlined"
          sx={{
            maxWidth: 500,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Box>
            <h4 className="mb-6">Select Purchase Orders</h4>

            <div>
              <List size="sm">
                {unservedPOs !== undefined &&
                  unservedPOs.length > 0 &&
                  unservedPOs.map((PO) => (
                    <ListItem key={PO.id}>
                      <Checkbox
                        checked={!!checkedPOs[PO.reference_number]}
                        label={`Ref No. ${PO.reference_number}`}
                        onChange={() =>
                          handleCheckboxChange(PO.reference_number)
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            </div>
            <div className="flex justify-end mt-5">
              <Button
                className="ml-4 w-[130px]"
                size="sm"
                variant="outlined"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="ml-4 w-[130px] bg-button-primary"
                color="primary"
                size="sm"
                onClick={selectCheckedPOs}
              >
                Confirm
              </Button>
            </div>
          </Box>
        </Sheet>
      </div>
    </Modal>
  );
};

export default SelectPOModal;
