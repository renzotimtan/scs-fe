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

const INITIAL_SELECTED_ITEMS = [{ id: null }];

const POFormDetails = ({
  openEdit,
  selectedRow,
  suppliers,
  setSelectedItems,

  // Fields
  selectedSupplier,
  setSelectedSupplier,
  status,
  setStatus,
  transactionDate,
  setTransactionDate,
  remarks,
  setRemarks,
  referenceNumber,
  setReferenceNumber,
  currencyUsed,
  setCurrencyUsed,
  pesoRate,
  setPesoRate,

  // Summary Amounts
  fobTotal,
  netAmount,
  landedTotal,
}: any): JSX.Element => {
  const isEditDisabled =
    selectedRow !== undefined && selectedRow?.status !== "unposted";

  return (
    <Box sx={{ display: "flex" }}>
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>PO No. {selectedRow?.id}</h4>
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
          <FormControl size="sm" sx={{ mb: 1, mt: 2 }}>
            <FormLabel>Customer</FormLabel>
            <div className="flex">
              <Autocomplete
                options={suppliers.items}
                getOptionLabel={(option) => option.name}
                value={selectedSupplier}
                onChange={(event, newValue) => {
                  setSelectedSupplier(newValue);
                  setSelectedItems(INITIAL_SELECTED_ITEMS);
                }}
                size="sm"
                className="w-[100%]"
                placeholder="Select Supplier"
                disabled={isEditDisabled}
                required
              />
            </div>
          </FormControl>
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
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Currency Used</FormLabel>
              <Select
                onChange={(event, value) => {
                  if (value !== null) setCurrencyUsed(value);
                }}
                size="sm"
                placeholder="USD"
                value={currencyUsed}
                disabled={isEditDisabled}
              >
                {AVAILABLE_CURRENCIES.map((currency) => (
                  <Option key={currency} value={currency}>
                    {currency}
                  </Option>
                ))}
              </Select>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Philippine Peso Rate</FormLabel>
              <Input
                startDecorator="₱"
                type="number"
                size="sm"
                placeholder="56"
                value={pesoRate}
                onChange={(e) => setPesoRate(e.target.value)}
                slotProps={{
                  input: {
                    min: 0,
                    step: ".01",
                  },
                }}
                disabled={isEditDisabled}
                required
              />
            </FormControl>
          </Stack>
          <FormControl size="sm" sx={{ mb: 3 }}>
            <FormLabel>Remarks</FormLabel>
            <Textarea
              minRows={3}
              placeholder="Remarks"
              onChange={(e) => setRemarks(e.target.value)}
              value={remarks}
              disabled={isEditDisabled}
              required
            />
          </FormControl>
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="flex justify-around">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>FOB Total</FormLabel>
              <h5>{`${currencyUsed} ${addCommaToNumberWithFourPlaces(fobTotal)}`}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>NET Amount</FormLabel>
              <h5>{`${currencyUsed} ${addCommaToNumberWithFourPlaces(netAmount)}`}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>LANDED Total</FormLabel>
              <h5>{`${currencyUsed} ${addCommaToNumberWithFourPlaces(landedTotal / pesoRate)}`}</h5>
            </FormControl>
          </div>
          <div className="flex justify-around">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>FOB Total</FormLabel>
              <h5>
                ₱{addCommaToNumberWithFourPlaces(fobTotal * pesoRate)}
              </h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>NET Amount</FormLabel>
              <h5>₱{addCommaToNumberWithFourPlaces(netAmount * pesoRate)}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>LANDED Total</FormLabel>
              <h5>₱{addCommaToNumberWithFourPlaces(landedTotal)}</h5>
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
        </div>
      </Card>
    </Box>
  );
};

export default POFormDetails;
