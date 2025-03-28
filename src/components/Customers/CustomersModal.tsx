import React, { useEffect, useState } from "react";
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
  Select,
  Option,
  Textarea,
} from "@mui/joy";
import { AVAILABLE_CURRENCIES } from "../../constants";
import { toast } from "react-toastify";

import type { Customer, CustomersModalProps } from "../../interface";

const CustomersModal = ({
  open,
  title,
  setOpen,
  row,
  onSave,
}: CustomersModalProps): JSX.Element => {
  const generateCustomer = (): Customer => {
    return {
      customer_id: row?.customer_id ?? 0,
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
      discount_rate: row?.discount_rate,
      customer_balance: row?.customer_balance,
      created_by: row?.created_by ?? 0,
      modified_by: row?.modified_by ?? 0,
      date_created: row?.date_created ?? "",
      date_modified: row?.date_modified ?? "",
      notes: row?.notes ?? "",
    };
  };

  const [customer, setCustomer] = useState<Customer>(generateCustomer());

  useEffect(() => {
    setCustomer(generateCustomer());
  }, [row]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ): void => {
    const { name, value } = e.target;
    setCustomer({ ...customer, [name]: value });
  };

  const handleSave = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      await onSave(customer);
      setCustomer(generateCustomer());
      setOpen(false);
    } catch (error: any) {
      toast.error(
        `Error message: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
      );
    }
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
      setCustomer({ ...customer, currency: value });
    }
  };

  return (
    <Modal
      aria-labelledby="modal-title"
      aria-describedby="modal-desc"
      open={open}
      onClose={(event, reason) => {
        if (reason === "backdropClick") return;
        setCustomer(generateCustomer());
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
                      value={customer.code}
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
                      value={customer.name}
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
                      value={customer.building_address}
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
                      value={customer.street_address}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>City</FormLabel>
                    <Input
                      size="sm"
                      placeholder="City"
                      name="city"
                      value={customer.city}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Province</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Province"
                      name="province"
                      value={customer.province}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Country</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Country"
                      name="country"
                      value={customer.country}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Zip Code</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Zip Code"
                      name="zip_code"
                      value={customer.zip_code}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Contact Person</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Contact Person"
                      name="contact_person"
                      value={customer.contact_person}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Contact Number</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Contact Number"
                      name="contact_number"
                      value={customer.contact_number}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Email</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Email"
                      name="email"
                      value={customer.email}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Fax Number</FormLabel>
                    <Input
                      size="sm"
                      placeholder="Fax Number"
                      name="fax_number"
                      value={customer.fax_number}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Currency</FormLabel>
                    <Select
                      name="currency"
                      size="sm"
                      value={customer?.currency}
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
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Discount Rate</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      placeholder="0"
                      name="discount_rate"
                      value={customer.discount_rate}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ mb: 1, width: "23%" }}>
                    <FormLabel>Customer Balance</FormLabel>
                    <Input
                      size="sm"
                      type="number"
                      placeholder="0"
                      name="customer_balance"
                      value={customer.customer_balance}
                      onChange={handleChange}
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <FormControl size="sm" sx={{ mb: 1, width: "100%" }}>
                    <FormLabel>Notes</FormLabel>
                    <Textarea
                      size="sm"
                      minRows={5}
                      name="notes"
                      value={customer.notes}
                      onChange={handleChange}
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

export default CustomersModal;
