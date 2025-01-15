import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Card,
  Stack,
  Button,
  Select,
  Option,
  Box,
  Divider,
  Autocomplete,
} from "@mui/joy";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { AVAILABLE_CURRENCIES } from "../../../constants";
import {
  formatToDateTime,
  addCommaToNumberWithFourPlaces,
} from "../../../helper";
import type { CPOFormProps } from "../interface";

const INITIAL_SELECTED_ITEMS = [{ id: null }];

const CPOFormDetails = ({
  openEdit,
  selectedRow,
  customers,
  setSelectedItems,

  // Fields
  selectedCustomer,
  setSelectedCustomer,
  status,
  setStatus,
  transactionDate,
  setTransactionDate,
  discounts,
  setDiscounts,
  remarks,
  setRemarks,
  referenceNumber,
  setReferenceNumber,
  priceLevel,
  setPriceLevel,
  // Summary Amounts
  netTotal,
  grossTotal,
}: CPOFormProps): JSX.Element => {
  const isEditDisabled =
    selectedRow !== undefined && selectedRow?.status !== "unposted";

  const handleDiscountChange = (
    type: "customer" | "transaction",
    index: number,
    value: string,
  ): void => {
    const newDiscounts = { ...discounts };
    newDiscounts[type][index] = value;
    setDiscounts(newDiscounts);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>CPO No. {selectedRow?.id}</h4>
              </div>
            )}
            <Button
              className="w-[130px] h-[35px] bg-button-neutral"
              size="sm"
              color="neutral"
            >
              <LocalPrintshopIcon className="mr-2" />
              Print
            </Button>
          </div>
          <Divider />
          <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 2 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Customer</FormLabel>
              <div className="flex">
                <Autocomplete
                  options={customers.items}
                  getOptionLabel={(option) => option.name}
                  value={selectedCustomer}
                  onChange={(event, newValue) => {
                    setSelectedCustomer(newValue);
                  }}
                  size="sm"
                  className="w-[100%]"
                  placeholder="Select Customer"
                  disabled={isEditDisabled}
                  required
                />
              </div>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Price Level</FormLabel>
              <Select
                onChange={(event, value) => {
                  if (value !== null) setPriceLevel(value);
                }}
                size="sm"
                value={priceLevel}
                disabled={isEditDisabled}
              >
                <Option value="1">1</Option>
                <Option value="2">2</Option>
                <Option value="3">3</Option>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Status</FormLabel>
              <Select
                onChange={(event, value) => {
                  if (value !== null) setStatus(value);
                }}
                size="sm"
                value={status}
                disabled={isEditDisabled}
              >
                <Option value="unposted">Unposted</Option>
                <Option value="posted">Posted</Option>
                <Option value="completed">Completed</Option>
              </Select>
            </FormControl>

            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Transaction Date</FormLabel>
              <Input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                disabled={isEditDisabled}
                required
              />
            </FormControl>
          </Stack>
          <Stack direction="column" spacing={2} sx={{ mb: 1 }}>
            {discounts.customer.map((discount: string, index: number) => (
              <Stack key={`discount-row-${index}`} direction="row" spacing={2}>
                <FormControl size="sm" sx={{ width: "48%" }}>
                  <FormLabel>{`Customer Discount ${index + 1}`}</FormLabel>
                  <Input
                    value={discount}
                    onChange={(e) =>
                      handleDiscountChange("customer", index, e.target.value)
                    }
                    placeholder="Enter % or actual discount"
                    disabled={isEditDisabled}
                  />
                </FormControl>
                <FormControl size="sm" sx={{ width: "48%" }}>
                  <FormLabel>{`Transaction Discount ${index + 1}`}</FormLabel>
                  <Input
                    value={discounts.transaction[index]}
                    onChange={(e) =>
                      handleDiscountChange("transaction", index, e.target.value)
                    }
                    placeholder="Enter % or actual discount"
                    disabled={isEditDisabled}
                  />
                </FormControl>
              </Stack>
            ))}
          </Stack>
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="flex justify-around">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Gross Total</FormLabel>
              <h5>{addCommaToNumberWithFourPlaces(grossTotal)}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>NET Amount</FormLabel>
              <h5>{addCommaToNumberWithFourPlaces(netTotal)}</h5>
            </FormControl>
          </div>
          <Divider />
          <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 3 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Created by</FormLabel>
              <p className="text-sm">
                {selectedRow?.creator?.full_name ?? "-"}
              </p>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Date Created</FormLabel>
              <p className="text-sm">
                {formatToDateTime(selectedRow?.date_created)}
              </p>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Modified by</FormLabel>
              <p className="text-sm">
                {selectedRow?.modifier?.full_name ?? "-"}
              </p>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Date Modified</FormLabel>
              <p className="text-sm">
                {formatToDateTime(selectedRow?.date_modified)}
              </p>
            </FormControl>
          </Stack>
          <FormControl size="sm" sx={{ mb: 1, mt: 2.5 }}>
            <FormLabel>Reference No.</FormLabel>
            <Input
              size="sm"
              placeholder="Search"
              onChange={(e) => setReferenceNumber(e.target.value)}
              value={referenceNumber}
              disabled={isEditDisabled}
              required
            />
          </FormControl>
          <FormControl size="sm" sx={{ mb: 3 }}>
            <FormLabel>Remarks</FormLabel>
            <Textarea
              minRows={1}
              placeholder="Remarks"
              onChange={(e) => setRemarks(e.target.value)}
              value={remarks}
              disabled={isEditDisabled}
            />
          </FormControl>
        </div>
      </Card>
    </Box>
  );
};

export default CPOFormDetails;
