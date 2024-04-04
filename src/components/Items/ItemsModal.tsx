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
  Autocomplete,
} from "@mui/joy";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";

interface Supplier {
  supplier_id: number;
  name: string;
}

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
      stock_code: row?.stock_code ?? "",
      name: row?.name ?? "",
      supplier_id: row?.supplier_id ?? 0,
      category: row?.category ?? "",
      brand: row?.brand ?? "",
      acquisition_cost: row?.acquisition_cost ?? 0,
      net_cost_before_tax: row?.net_cost_before_tax ?? 0,
      currency: row?.currency ?? "",
      rate: row?.rate ?? 0,
      total_on_stock: row?.total_on_stock ?? 0,
      total_available: row?.total_available ?? 0,
      total_allocated: row?.total_allocated ?? 0,
      total_purchased: row?.total_purchased ?? 0,
      created_by: row?.created_by ?? 0,
      modified_by: row?.modified_by ?? 0,
      date_created: row?.date_created ?? "",
      date_modified: row?.date_modified ?? "",
      // item_modifier: row?.item_modifier ?? "", // Add default value for item_modifier
      // unit: row?.unit ?? "", // Add default value for unit
      // previous_cost: row?.previous_cost ?? 0, // Add default value for previous_cost
      // last_sale_price: row?.last_sale_price ?? 0, // Add default value for last_sale_price
    };
  };

  const [item, setItem] = useState<Item>(generateItem());
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    setItem(generateItem());
    void fetchSuppliers();
  }, [row]);

  const fetchSuppliers = async (): Promise<void> => {
    try {
      const response = await axiosInstance.get<Supplier[]>("/api/suppliers/");
      setSuppliers(response.data);
      console.log("Suppliers:", response.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name } = e.target;
    const value =
      e.target instanceof HTMLSelectElement
        ? e.target.value
        : (e.target as HTMLInputElement).value;
    setItem({ ...item, [name]: value });
  };

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await onSave(item);
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
      <form onSubmit={async (e) => await handleSave(e)}>
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
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Stock Code</FormLabel>
                    <Input
                      name="stock_code"
                      size="sm"
                      placeholder="ABC-123"
                      value={item?.stock_code}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      name="name"
                      size="sm"
                      placeholder="Item Name"
                      value={item?.name}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Category</FormLabel>
                    <Input
                      name="category"
                      size="sm"
                      placeholder="Fans"
                      value={item?.category}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Brand</FormLabel>
                    <Input
                      name="brand"
                      size="sm"
                      placeholder="Hayes"
                      value={item?.brand}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Acquision Cost (₱)</FormLabel>
                    <Input
                      name="acquisition_cost"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={item?.acquisition_cost}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Net Cost B/F Tax (₱)</FormLabel>
                    <Input
                      name="net_cost_before_tax"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={item?.net_cost_before_tax}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Currency Used</FormLabel>
                    <Input
                      name="currency"
                      size="sm"
                      placeholder="USD"
                      value={item?.currency}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Philippine Peso Rate (₱)</FormLabel>
                    <Input
                      name="rate"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={item?.rate}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>On Stock</FormLabel>
                    <Input
                      name="total_on_stock"
                      type="number"
                      size="sm"
                      placeholder="0"
                      value={item?.total_on_stock}
                      disabled
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Available</FormLabel>
                    <Input
                      name="total_available"
                      type="number"
                      size="sm"
                      placeholder="0"
                      value={item?.total_available}
                      disabled
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Allocated</FormLabel>
                    <Input
                      name="total_allocated"
                      type="number"
                      size="sm"
                      placeholder="0"
                      value={item?.total_allocated}
                      disabled
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Purchased</FormLabel>
                    <Input
                      name="total_purchased"
                      type="number"
                      size="sm"
                      placeholder="0"
                      value={item?.total_purchased}
                      disabled
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "100%" }}>
                    <FormLabel>Supplier</FormLabel>
                    <Autocomplete
                      placeholder="Select a supplier"
                      options={suppliers.map((supplier) => supplier.name)}
                      value={
                        suppliers.find(
                          (supplier) =>
                            supplier.supplier_id === item.supplier_id,
                        )?.name ?? ""
                      }
                      onChange={(event, newValue) => {
                        const selectedSupplier = suppliers.find(
                          (supplier) => supplier.name === newValue,
                        );
                        setItem({
                          ...item,
                          supplier_id:
                            selectedSupplier != null
                              ? selectedSupplier.supplier_id
                              : 0,
                        });
                      }}
                      sx={{ width: "100%" }}
                      required
                    />
                  </FormControl>
                </Stack>
              </div>
            </Card>
            <div className="flex justify-end mt-5">
              <Button
                type="submit"
                className="ml-4 w-[130px] bg-button-primary"
                size="sm"
              >
                Save
              </Button>
            </div>
          </Box>
        </Sheet>
      </form>
    </Modal>
  );
};

export default ItemsModal;
