import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Card,
  Stack,
  Select,
  Option,
  Box,
  Divider,
  Autocomplete,
} from "@mui/joy";
import type { ARFormDetailsProps } from "../interface";
import {
  formatToDateTime,
  addCommaToNumberWithFourPlaces,
} from "../../../helper";

const ARFormDetails = ({
  openEdit,
  selectedRow,
  customers,
  selectedCustomer,
  setSelectedCustomer,
  fetchARByCustomer,
  status,
  setStatus,
  transactionDate,
  setTransactionDate,
  remarks,
  setRemarks,
  isEditDisabled,
  paymentMode,
  setPaymentMode,
  checkDate,
  setCheckDate,
  checkNumber,
  setCheckNumber,
  amountPaid,
  setAmountPaid,
  lessAmount,
  setLessAmount,
  addAmount1,
  addAmount2,
  addAmount3,
  setAddAmount1,
  setAddAmount2,
  setAddAmount3,
  totalApplied,
  paymentAmount,
  refNo,
  setRefNo,
}: ARFormDetailsProps): JSX.Element => {
  return (
    <Box sx={{ display: "flex" }}>
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>Receipt No. {selectedRow?.id}</h4>
              </div>
            )}
          </div>
          {openEdit && <Divider />}

          <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, mt: 1, width: "22%" }}>
              <FormLabel>Customer</FormLabel>
              <div className="flex">
                <Autocomplete
                  options={customers.items}
                  getOptionLabel={(option) => option.name}
                  value={selectedCustomer}
                  onChange={(event, newValue) => {
                    setSelectedCustomer(newValue);
                    if (newValue !== undefined && newValue !== null)
                      fetchARByCustomer(newValue?.customer_id);
                  }}
                  size="sm"
                  className="w-[100%]"
                  placeholder="Select Customer"
                  disabled={isEditDisabled}
                  required
                />
              </div>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Status</FormLabel>
              <Select
                onChange={(event, value) => {
                  if (value !== null) setStatus(value);
                }}
                size="sm"
                value={status}
                disabled={isEditDisabled}
              >
                <Option value="posted">Posted</Option>
                <Option value="unposted">Unposted</Option>
              </Select>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Transaction Date</FormLabel>
              <Input
                type="date"
                value={transactionDate}
                onChange={(e) => setTransactionDate(e.target.value)}
                disabled={isEditDisabled}
                required
              />
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Payment Mode</FormLabel>
              <Select
                onChange={(event, value) => {
                  if (value !== null) setPaymentMode(value);
                  setCheckDate("");
                  setCheckNumber("");
                }}
                size="sm"
                value={paymentMode}
                disabled={isEditDisabled}
              >
                <Option value="cash">Cash</Option>
                <Option value="check">Check</Option>
              </Select>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Amount Paid</FormLabel>
              <Input
                type="number"
                name="amountPaid"
                size="sm"
                placeholder="0"
                value={amountPaid}
                slotProps={{
                  input: {
                    min: 0,
                  },
                }}
                onChange={(e) => setAmountPaid(String(e.target.value))}
                disabled={isEditDisabled}
                required
              />
            </FormControl>
            {paymentMode === "check" && (
              <FormControl size="sm" sx={{ mb: 1, mt: 1, width: "22%" }}>
                <FormLabel>Check Number</FormLabel>
                <div className="flex">
                  <Input
                    name="checkNumber"
                    size="sm"
                    placeholder="Check Number"
                    value={checkNumber}
                    onChange={(e) => setCheckNumber(e.target.value)}
                    disabled={isEditDisabled || paymentMode !== "check"}
                  />
                </div>
              </FormControl>
            )}

            {paymentMode === "check" && (
              <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
                <FormLabel>Check Date</FormLabel>
                <Input
                  type="date"
                  value={checkDate}
                  onChange={(e) => setCheckDate(e.target.value)}
                  disabled={isEditDisabled || paymentMode !== "check"}
                />
              </FormControl>
            )}

            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Ref No.</FormLabel>
              <Input
                type="text"
                value={refNo}
                placeholder="0"
                onChange={(e) => setRefNo(e.target.value)}
                disabled={isEditDisabled}
              />
            </FormControl>
          </Stack>
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="flex justify-around">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Payment Amount</FormLabel>
              <h5>{addCommaToNumberWithFourPlaces(paymentAmount)}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total Applied</FormLabel>
              <h5>{addCommaToNumberWithFourPlaces(totalApplied)}</h5>
            </FormControl>
          </div>
          <Divider />
          <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "30%" }}>
              <FormLabel>Less</FormLabel>
              <Input
                type="number"
                name="lessAmount"
                size="sm"
                placeholder="0"
                value={lessAmount}
                slotProps={{
                  input: {
                    min: 0,
                  },
                }}
                onChange={(e) => setLessAmount(String(e.target.value))}
                disabled={isEditDisabled}
              />
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, mt: 1, width: "30%" }}>
              <FormLabel>Add</FormLabel>
              <div className="flex">
                <Input
                  type="number"
                  name="addAmount1"
                  size="sm"
                  placeholder="0"
                  value={addAmount1}
                  slotProps={{
                    input: {
                      min: 0,
                    },
                  }}
                  onChange={(e) => setAddAmount1(String(e.target.value))}
                  disabled={isEditDisabled}
                />
              </div>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "30%" }}>
              <FormLabel>Remarks</FormLabel>
              <Textarea
                minRows={1}
                placeholder="Remarks"
                onChange={(e) => setRemarks(e.target.value)}
                value={remarks}
                disabled={isEditDisabled}
              />
            </FormControl>
            {/* <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Add 2</FormLabel>
              <Input
                type="number"
                name="addAmount2"
                size="sm"
                placeholder="0"
                value={addAmount2}
                slotProps={{
                  input: {
                    min: 0,
                  },
                }}
                onChange={(e) => setAddAmount2(String(e.target.value))}
                disabled={isEditDisabled}
                required
              />
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Add 3</FormLabel>
              <Input
                type="number"
                name="addAmount3"
                size="sm"
                placeholder="0"
                value={addAmount3}
                slotProps={{
                  input: {
                    min: 0,
                  },
                }}
                onChange={(e) => setAddAmount3(String(e.target.value))}
                disabled={isEditDisabled}
                required
              />
            </FormControl> */}
          </Stack>

          <Divider />
          <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Created by</FormLabel>
              <p className="text-sm">
                {selectedRow?.creator?.full_name ?? "-"}
              </p>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Date Created</FormLabel>
              <p className="text-sm">
                {formatToDateTime(selectedRow?.date_created)}
              </p>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Modified by</FormLabel>
              <p className="text-sm">
                {selectedRow?.modifier?.full_name ?? "-"}
              </p>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Date Modified</FormLabel>
              <p className="text-sm">
                {formatToDateTime(selectedRow?.date_modified)}
              </p>
            </FormControl>
          </Stack>
        </div>
      </Card>
    </Box>
  );
};

export default ARFormDetails;
