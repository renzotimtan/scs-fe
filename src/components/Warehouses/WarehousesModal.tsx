import React, { useEffect, useState } from "react";
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
  onSave: (newWarehouse: Warehouse) => Promise<void>;
}

const WarehousesModal = ({
  open,
  title,
  setOpen,
  row,
  onSave,
}: WarehousesModalProps): JSX.Element => {
  const generateWarehouse = (): Warehouse => {
    return {
      id: row?.id ?? 0,
      name: row?.name ?? "",
      code: row?.code ?? "",
      type: row?.type ?? "Stock",
      created_by: row?.created_by ?? 0,
      modified_by: row?.modified_by ?? 0,
      date_created: row?.date_created ?? "",
      date_modified: row?.date_modified ?? "",
    };
  };

  const [warehouse, setWarehouse] = useState<Warehouse>(generateWarehouse());

  useEffect(() => {
    setWarehouse(generateWarehouse());
  }, [row]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setWarehouse({ ...warehouse, [name]: value });
  };

  const handleSelectChange = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    value: string | null,
  ): void => {
    if (value !== null) {
      setWarehouse({ ...warehouse, type: value });
    }
  };

  const handleSave = async (): Promise<void> => {
    await onSave(warehouse);
    setOpen(false);
  };

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
                    <Input
                      size="sm"
                      placeholder="ABC-123"
                      name="code"
                      value={warehouse.code}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Name"
                      name="name"
                      value={warehouse.name}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Type</FormLabel>
                    <Select
                      name="type"
                      value={warehouse.type}
                      size="sm"
                      onChange={handleSelectChange}
                    >
                      <Option value="Stock">Stock</Option>
                      <Option value="Receiving">Receiving</Option>
                      <Option value="Preparation">Preparation</Option>
                    </Select>
                  </FormControl>
                </Stack>
              </div>
            </Card>
            <div className="flex justify-end mt-5">
              <Button
                className="ml-4 w-[130px] bg-button-primary"
                size="sm"
                onClick={handleSave}
              >
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
