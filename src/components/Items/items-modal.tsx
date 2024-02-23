import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import type { Item } from "../../pages/configuration/item";
import {
  FormControl,
  FormLabel,
  Input,
  Card,
  Stack,
  Button,
  Box,
} from "@mui/joy";

interface ItemsModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  row?: Item;
}

const ItemsModal = ({
  open,
  title,
  setOpen,
  row,
}: ItemsModalProps): JSX.Element => {
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
            <h3 className="mb-6">{title}</h3>
            <Card className="w-[100%] mr-7">
              <div>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Stock Code</FormLabel>
                    <Input
                      size="sm"
                      placeholder="ABC-123"
                      value={row?.stockCode}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Item Name"
                      value={row?.name}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Category</FormLabel>
                    <Input size="sm" placeholder="Fans" value={row?.category} />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Brand</FormLabel>
                    <Input size="sm" placeholder="Hayes" value={row?.brand} />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Acquision Cost (₱)</FormLabel>
                    <Input
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.acquisitionCost}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Net Cost B/F Tax (₱)</FormLabel>
                    <Input
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.netCostTax}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Currency Used</FormLabel>
                    <Input
                      size="sm"
                      placeholder="USD"
                      value={row?.currencyUsed}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Philippine Peso Rate (₱)</FormLabel>
                    <Input
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.pesoRate}
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
                      value={row?.onStock}
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
                      value={row?.available}
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
                      value={row?.allocated}
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
                      value={row?.purchased}
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

export default ItemsModal;
