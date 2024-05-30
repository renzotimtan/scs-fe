import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Button, Box, ListItem, List, Checkbox } from "@mui/joy";
import type { DeliveryReceipt } from "../../../interface";

const SelectSDRModal = ({
  open,
  setOpen,
  unservedSDRs,
  setSelectedSDRs,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  unservedSDRs: DeliveryReceipt[];
  setSelectedSDRs: Dispatch<SetStateAction<DeliveryReceipt[]>>;
}): JSX.Element => {
  const [checkedSDRs, setCheckedSDRs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const options: Record<string, boolean> = {};
    unservedSDRs.forEach((SDR) => {
      options[SDR.reference_number] = false;
    });
    setCheckedSDRs(options);
  }, [unservedSDRs]);

  const handleCheckboxChange = (referenceNumber: string): void => {
    setCheckedSDRs((prev) => ({
      ...prev,
      [referenceNumber]: !prev[referenceNumber],
    }));
  };

  const selectCheckedPOs = (): void => {
    const selectedRefNos = Object.keys(checkedSDRs).filter(
      (refNo) => checkedSDRs[refNo],
    );

    const selectedPOs = unservedSDRs.filter((SDR) =>
      selectedRefNos.includes(SDR.reference_number),
    );

    setSelectedSDRs(selectedPOs);
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
                {unservedSDRs !== undefined &&
                  unservedSDRs.length > 0 &&
                  unservedSDRs.map((SDR) => (
                    <ListItem key={SDR.id}>
                      <Checkbox
                        checked={!!checkedSDRs[SDR.reference_number]}
                        label={`Ref No. ${SDR.reference_number}`}
                        onChange={() =>
                          handleCheckboxChange(SDR.reference_number)
                        }
                      />
                    </ListItem>
                  ))}
                {(unservedSDRs === undefined || unservedSDRs.length === 0) &&
                  "No Supplier Delivery Receipts"}
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

export default SelectSDRModal;
