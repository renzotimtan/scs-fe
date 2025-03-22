import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import { Button, Box, Input } from "@mui/joy";

const ReverseARModal = ({
  open,
  title,
  setOpen,
  onDelete,
  reverseReason,
  setReverseReason,
}: {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  onDelete: () => Promise<void>;
  reverseReason: string;
  setReverseReason: (reason: string) => void;
}): JSX.Element => {
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
            <h4 className="mb-6">{title}</h4>
            <div className="mb-3">
              <p className="text-sm">
                Are you sure you want to reverse this AR Receipt?
              </p>
            </div>
            <div className="mb-7">
              <h5 className="mb-2">Reason (Optional)</h5>
              <Input
                type="text"
                size="sm"
                value={reverseReason}
                placeholder="Reason for Bounce Check"
                onChange={(e) => setReverseReason(e.target.value)}
              />
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
                className="ml-4 w-[130px] bg-button-warning"
                color="danger"
                size="sm"
                onClick={async () => {
                  await onDelete(); // Call the onDelete function when the button is clicked
                  setOpen(false);
                }}
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

export default ReverseARModal;
