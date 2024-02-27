import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import type { Warehouse } from "../../pages/configuration/warehouse";
import {
  FormControl,
  FormLabel,
  Input,
  Card,
  Stack,
  Button,
  Box,
} from "@mui/joy";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

interface WarehousesModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  row?: Warehouse;
}

const WarehousesModal = ({
  open,
  title,
  setOpen,
  row,
}: WarehousesModalProps): JSX.Element => {
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
                    <FormLabel>Code</FormLabel>
                    <Input size="sm" placeholder="ABC-123" value={row?.code} />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Name</FormLabel>
                    <Input size="sm" placeholder="Name" value={row?.name} />
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Type</FormLabel>
                    <Select defaultValue="stock" size="sm">
                      <Option value="stock">Stock</Option>
                      <Option value="receiving">Receiving</Option>
                      <Option value="preparation">Preparation</Option>
                    </Select>
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

export default WarehousesModal;
