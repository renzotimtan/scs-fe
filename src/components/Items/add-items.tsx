import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import SaveIcon from "@mui/icons-material/Save";
import {
  FormControl,
  FormLabel,
  Input,
  Card,
  Stack,
  Button,
  Box,
} from "@mui/joy";

interface AddItemsModalProps {
  className: string;
  open: boolean;
  setOpen: (isOpen: boolean) => void;
}

const AddItemsModal = ({
  className,
  open,
  setOpen,
}: AddItemsModalProps): JSX.Element => {
  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={() => {
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
            <h3 className="mb-6">Add Item</h3>
            <Card className="w-[100%] mr-7">
              <div>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Stock Code</FormLabel>
                    <Input size="sm" placeholder="ABC-123" />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Name</FormLabel>
                    <Input size="sm" placeholder="Item Name" />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Category</FormLabel>
                    <Input size="sm" placeholder="Fans" />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Brand</FormLabel>
                    <Input size="sm" placeholder="Hayes" />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Acquision Cost</FormLabel>
                    <Input
                      type="number"
                      startDecorator="₱"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Net Cost B/F Tax</FormLabel>
                    <Input
                      type="number"
                      startDecorator="₱"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Currency Used</FormLabel>
                    <Input size="sm" placeholder="USD" />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Philippine Peso Rate</FormLabel>
                    <Input
                      type="number"
                      startDecorator="₱"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>On Stock</FormLabel>
                    <Input
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Available</FormLabel>
                    <Input
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Allocated</FormLabel>
                    <Input
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Purchased</FormLabel>
                    <Input
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                    />
                  </FormControl>
                </Stack>
              </div>
            </Card>
            <div className="flex justify-end mt-5">
              <Button className="ml-4 w-[130px] bg-button-primary" size="sm">
                Save
              </Button>
            </div>
          </Box>
        </Sheet>
      </div>
    </Modal>
  );
};

export default AddItemsModal;
