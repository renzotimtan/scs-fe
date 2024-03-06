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
import { useState, useEffect } from "react";

interface ItemsModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  row?: Item;
  onSave: (newItem: Item) => Promise<void>;
}

const ItemsModal = ({
  open,
  title,
  setOpen,
  row,
  onSave,
}: ItemsModalProps): JSX.Element => {
  const generateItem = (): Item => {
    return {
      id: row?.id ?? 0,
      stockCode: row?.stockCode ?? "",
      name: row?.name ?? "",
      category: row?.category ?? "",
      brand: row?.brand ?? "",
      acquisitionCost: row?.acquisitionCost ?? 0,
      netCostTax: row?.netCostTax ?? 0,
      currencyUsed: row?.currencyUsed ?? "",
      pesoRate: row?.pesoRate ?? 0,
      onStock: row?.onStock ?? 0,
      available: row?.available ?? 0,
      allocated: row?.allocated ?? 0,
      purchased: row?.purchased ?? 0,
    };
  };

  const [item, setItem] = useState<Item>(generateItem());

  useEffect(() => {
    setItem(generateItem());
  }, [row]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const handleSave = async (): Promise<void> => {
    await onSave(item);
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
                    <FormLabel>Stock Code</FormLabel>
                    <Input
                      name="stockCode"
                      size="sm"
                      placeholder="ABC-123"
                      value={row?.stockCode}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      size="sm"
                      placeholder="Item Name"
                      value={row?.name}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Category</FormLabel>
                    <Input
                      name="category"
                      size="sm"
                      placeholder="Fans"
                      value={row?.category}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Brand</FormLabel>
                    <Input
                      name="brand"
                      size="sm"
                      placeholder="Hayes"
                      value={row?.brand}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Acquision Cost (₱)</FormLabel>
                    <Input
                      name="acquisitionCost"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.acquisitionCost}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Net Cost B/F Tax (₱)</FormLabel>
                    <Input
                      name="netCostTax"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.netCostTax}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Currency Used</FormLabel>
                    <Input
                      name="currencyUsed"
                      size="sm"
                      placeholder="USD"
                      value={row?.currencyUsed}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Philippine Peso Rate (₱)</FormLabel>
                    <Input
                      name="pesoRate"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.pesoRate}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>On Stock</FormLabel>
                    <Input
                      name="onStock"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.onStock}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Available</FormLabel>
                    <Input
                      name="available"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.available}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Allocated</FormLabel>
                    <Input
                      name="allocated"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.allocated}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                    <FormLabel>Purchased</FormLabel>
                    <Input
                      name="purchased"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={row?.purchased}
                      onChange={handleChange}
                    />
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

export default ItemsModal;
