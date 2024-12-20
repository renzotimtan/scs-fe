import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import {
  FormControl,
  FormLabel,
  Input,
  Card,
  Stack,
  Button,
  Box,
  Autocomplete,
  Select,
  Option,
} from "@mui/joy";
import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { AVAILABLE_CURRENCIES } from "../../constants";
import { toast } from "react-toastify";
import type {
  Item,
  PaginatedSuppliers,
  ItemsModalProps,
} from "../../interface";

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
      status: row?.status ?? "",
      category: row?.category ?? "",
      brand: row?.brand ?? "",
      acquisition_cost: row?.acquisition_cost,
      net_cost_before_tax: row?.net_cost_before_tax,
      currency: row?.currency ?? "",
      rate: row?.rate,
      srp: row?.srp,
      last_sale_price: row?.last_sale_price,
      total_on_stock: row?.total_on_stock ?? 0,
      total_available: row?.total_available ?? 0,
      total_allocated: row?.total_allocated ?? 0,
      total_purchased: row?.total_purchased ?? 0,
      created_by: row?.created_by ?? 0,
      modified_by: row?.modified_by ?? 0,
      date_created: row?.date_created ?? "",
      date_modified: row?.date_modified ?? "",
    };
  };

  const [item, setItem] = useState<Item>(generateItem());
  const [suppliers, setSuppliers] = useState<PaginatedSuppliers>({
    total: 0,
    items: [],
  });

  useEffect(() => {
    setItem(generateItem());
    void fetchSuppliers();
  }, [row]);

  const fetchSuppliers = async (): Promise<void> => {
    try {
      const response =
        await axiosInstance.get<PaginatedSuppliers>("/api/suppliers/");
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

  const handleSelectChange = (
    event:
      | React.MouseEvent<Element, MouseEvent>
      | React.KeyboardEvent<Element>
      | React.FocusEvent<Element, Element>
      | null,
    value: string | null,
  ): void => {
    if (value !== null) {
      setItem({ ...item, currency: value });
    }
  };

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    try {
      await onSave(item);
      setItem(generateItem());
      setOpen(false);
    } catch (error: any) {
      toast.error(
        `Error message: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
      );
    }
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        setItem(generateItem());
        setOpen(false);
      }}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <form onSubmit={async (e) => await handleSave(e)}>
        <Sheet
          variant="outlined"
          sx={{
            width: 800,
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
                    <FormLabel>Status</FormLabel>
                    <Select
                      name="status"
                      size="sm"
                      value={item?.status}
                      onChange={(event, value) => {
                        if (value !== null) {
                          setItem({ ...item, status: value });
                        }
                      }}
                      required
                    >
                      <Option value="active">Active</Option>
                      <Option value="inactive">Inactive</Option>
                    </Select>
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl size="sm" sx={{ mb: 1, width: "98%" }}>
                    <FormLabel>Description</FormLabel>
                    <Input
                      name="name"
                      size="sm"
                      placeholder="Stock Description"
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
                  <FormControl size="sm" sx={{ mb: 1, width: "22.9%" }}>
                    <FormLabel>Acquisition Cost (₱)</FormLabel>
                    <Input
                      name="acquisition_cost"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                          step: ".01",
                        },
                      }}
                      value={item?.acquisition_cost}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "22.9%" }}>
                    <FormLabel>Net Cost B/F Tax (₱)</FormLabel>
                    <Input
                      name="net_cost_before_tax"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                          step: ".01",
                        },
                      }}
                      value={item?.net_cost_before_tax}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "22.9%" }}>
                    <FormLabel>SRP (₱)</FormLabel>
                    <Input
                      name="srp"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                          step: ".01",
                        },
                      }}
                      value={item?.srp}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "22.9%" }}>
                    <FormLabel>Last Sale Price (₱)</FormLabel>
                    <Input
                      name="last_sale_price"
                      type="number"
                      size="sm"
                      placeholder="0"
                      slotProps={{
                        input: {
                          min: 0,
                          step: ".01",
                        },
                      }}
                      value={item?.last_sale_price}
                      onChange={handleChange}
                    />
                  </FormControl>
                </Stack>

                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Currency Used</FormLabel>
                    <Select
                      name="currency"
                      size="sm"
                      value={item?.currency}
                      onChange={handleSelectChange}
                      required
                    >
                      {AVAILABLE_CURRENCIES.map((currency) => (
                        <Option key={currency} value={currency}>
                          {currency}
                        </Option>
                      ))}
                    </Select>
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
                          step: ".01",
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
                  <FormControl size="sm" sx={{ mb: 1, width: "98%" }}>
                    <FormLabel>Supplier</FormLabel>
                    <Autocomplete
                      placeholder="Select a supplier"
                      options={suppliers.items.map((supplier) => supplier.name)}
                      value={
                        suppliers.items.find(
                          (supplier) =>
                            supplier.supplier_id === item.supplier_id,
                        )?.name ?? ""
                      }
                      onChange={(event, newValue) => {
                        const selectedSupplier = suppliers.items.find(
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
