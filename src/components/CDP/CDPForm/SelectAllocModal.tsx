import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Button, Box, ListItem, List, Checkbox, Table } from "@mui/joy";
import type { Alloc } from "../../../interface";

const SelectAllocModal = ({
  open,
  setOpen,
  unservedAllocs,
  setSelectedAllocs,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  unservedAllocs: Alloc[];
  setSelectedAllocs: Dispatch<SetStateAction<Alloc[]>>;
}): JSX.Element => {
  const [checkedAllocs, setCheckedAllocs] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const options: Record<string, boolean> = {};
    unservedAllocs.forEach((alloc) => {
      options[alloc.id] = false;
    });
    setCheckedAllocs(options);
  }, [unservedAllocs]);

  const handleCheckboxChange = (referenceNumber: string): void => {
    setCheckedAllocs((prev) => ({
      ...prev,
      [referenceNumber]: !prev[referenceNumber],
    }));
  };

  const selectCheckedAllocs = (): void => {
    const selectedIds = Object.keys(checkedAllocs).filter(
      (id) => checkedAllocs[id],
    );

    const selectedAllocs = unservedAllocs.filter((alloc) =>
      selectedIds.includes(String(alloc.id)),
    );

    setSelectedAllocs(selectedAllocs);
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
            maxWidth: 800,
            borderRadius: "md",
            p: 3,
            boxShadow: "lg",
          }}
        >
          <ModalClose variant="plain" sx={{ m: 1 }} />
          <Box>
            <h4 className="mb-6">Select Allocations</h4>
            <div>
              <List size="sm" className="h-[250px] w-100 overflow-y-scroll">
                <Table>
                  <thead>
                    <tr>
                      <th>Check</th>
                      <th>Alloc No.</th>
                      <th>Trans. Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unservedAllocs !== undefined &&
                      unservedAllocs.length > 0 &&
                      unservedAllocs.map((alloc) => (
                        <tr key={alloc.id}>
                          <td>
                            <ListItem>
                              <Checkbox
                                checked={!!checkedAllocs[alloc.id]}
                                onChange={() =>
                                  handleCheckboxChange(String(alloc.id))
                                }
                              />
                            </ListItem>
                          </td>
                          <td>{alloc.id}</td>
                          <td>{alloc.transaction_date}</td>
                        </tr>
                      ))}
                  </tbody>
                </Table>
                {(unservedAllocs === undefined ||
                  unservedAllocs.length === 0) && (
                  <p className="mt-5 text-sm">No Allocations to Plan</p>
                )}
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
                onClick={selectCheckedAllocs}
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

export default SelectAllocModal;
