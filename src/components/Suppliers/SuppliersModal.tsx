import React, { useEffect, useState } from "react";
import Modal from "@mui/joy/Modal";
import ModalClose from "@mui/joy/ModalClose";
import Sheet from "@mui/joy/Sheet";
import type { Supplier } from "../../pages/configuration/supplier";
import {
  FormControl,
  FormLabel,
  Input,
  Card,
  Stack,
  Button,
  Box,
} from "@mui/joy";

interface SuppliersModalProps {
  open: boolean;
  title: string;
  setOpen: (isOpen: boolean) => void;
  row?: Supplier;
  onSave: (newSupplier: Supplier) => Promise<void>;
}

const SuppliersModal = ({
  open,
  title,
  setOpen,
  row,
  onSave,
}: SuppliersModalProps): JSX.Element => {
  const generateSupplier = (): Supplier => {
    return {
      supplier_id: row?.supplier_id ?? 0,
      code: row?.code ?? "",
      name: row?.name ?? "",
      building_address: row?.building_address ?? "",
      street_address: row?.street_address ?? "",
      city: row?.city ?? "",
      province: row?.province ?? "",
      country: row?.country ?? "",
      zip_code: row?.zip_code ?? "",
      contact_person: row?.contact_person ?? "",
      contact_number: row?.contact_number ?? "",
      email: row?.email ?? "",
      fax_number: row?.fax_number ?? "",
      currency: row?.currency ?? "",
      discount_rate: row?.discount_rate ?? 0,
      supplier_balance: row?.supplier_balance ?? 0,
      created_by: row?.created_by ?? 0,
      modified_by: row?.modified_by ?? 0,
      date_created: row?.date_created ?? "",
      date_modified: row?.date_modified ?? "",
    };
  };

  const [supplier, setSupplier] = useState<Supplier>(generateSupplier());

  useEffect(() => {
    setSupplier(generateSupplier());
  }, [row]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setSupplier({ ...supplier, [name]: value });
  };

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    await onSave(supplier);
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
                    <FormLabel>Code</FormLabel>
                    <Input
                      size="sm"
                      placeholder="ABC-123"
                      name="code"
                      value={supplier.code}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Name</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Name"
                      name="name"
                      value={supplier.name}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Building Address</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Building Address"
                      name="building_address"
                      value={supplier.building_address}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Street Address</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Street Address"
                      name="street_address"
                      value={supplier.street_address}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>City</FormLabel>
                    <Input
                      size="sm"
                      placeholder="City"
                      name="city"
                      value={supplier.city}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Province</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Province"
                      name="province"
                      value={supplier.province}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Country</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Country"
                      name="country"
                      value={supplier.country}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Zip Code</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Zip Code"
                      name="zip_code"
                      value={supplier.zip_code}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Contact Person</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Contact Person"
                      name="contact_person"
                      value={supplier.contact_person}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Contact Number</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Contact Number"
                      name="contact_number"
                      value={supplier.contact_number}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Email"
                      name="email"
                      value={supplier.email}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Fax Number</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Fax Number"
                      name="fax_number"
                      value={supplier.fax_number}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Currency</FormLabel>
                    <Input
                      size="sm"
                      placeholder="USD"
                      name="currency"
                      value={supplier.currency}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Discount Rate</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      placeholder="0"
                      name="discount_rate"
                      value={supplier.discount_rate}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                    <FormLabel>Supplier Balance</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      placeholder="0"
                      name="supplier_balance"
                      value={supplier.supplier_balance}
                      onChange={handleChange}
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

export default SuppliersModal;
