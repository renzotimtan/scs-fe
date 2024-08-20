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
import type { RRFormDetailsProps } from "../interface";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import type { PaginatedSDR } from "../../../interface";
import SelectPOModal from "./SelectRRModal";
import { AVAILABLE_CURRENCIES } from "../../../constants";

const RRFormDetails = ({
  openEdit,
  selectedRow,
  suppliers,
  selectedSDRs,
  setSelectedSDRs,

  // Fields
  selectedSupplier,
  setSelectedSupplier,
  status,
  setStatus,
  transactionDate,
  setTransactionDate,
  pesoRate,
  setPesoRate,
  currencyUsed,
  setCurrencyUsed,
  remarks,
  setRemarks,
  referenceNumber,
  setReferenceNumber,
  amountDiscount,
  setAmountDiscount,

  // Summary Amounts
  fobTotal,
  netAmount,
  landedTotal,
  totalExpense,
  percentNetCost,
  isEditDisabled
}: RRFormDetailsProps): JSX.Element => {
  const [unservedSDRs, setUnservedSDRs] = useState<PaginatedSDR | undefined>();
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  useEffect(() => {
    if (selectedSupplier !== null && selectedSupplier !== undefined) {
      axiosInstance
        .get<PaginatedSDR>(
          `/api/supplier-delivery-receipts/?supplier_id=${selectedSupplier.supplier_id}`,
        )
        .then((response) => setUnservedSDRs(response.data))
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedSupplier]);

  const getFixedAmtDiscounts = (): void => {
    let total = 0;
    selectedSDRs.forEach((SDR) => {
      total += SDR.discount_amount;
    });

    setAmountDiscount(total);
  };

  useEffect(() => {
    if (!openEdit) getFixedAmtDiscounts();
  }, [selectedSDRs]);

  return (
    <Box sx={{ display: "flex" }}>
      <SelectPOModal
        open={isSelectModalOpen}
        setOpen={setIsSelectModalOpen}
        unservedSDRs={unservedSDRs}
        setSelectedSDRs={setSelectedSDRs}
      />
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>RR No. {selectedRow?.id}</h4>
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
            <FormLabel>Supplier</FormLabel>
            <div className="flex">
              <Autocomplete
                options={suppliers.items}
                getOptionLabel={(option) => option.name}
                value={selectedSupplier}
                onChange={(event, newValue) => {
                  setSelectedSupplier(newValue);
                  setSelectedSDRs([]);
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
              >
                <Option value="posted">Posted</Option>
                <Option value="unposted">Unposted</Option>
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
                onChange={(e) => setPesoRate(Number(e.target.value))}
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
          <Stack direction="column" spacing={2} sx={{ mb: 1 }}>
            <Stack direction="row" spacing={2}>
              <FormControl size="sm" sx={{ width: "48%" }}>
                <FormLabel>Amount Discounts Total</FormLabel>
                <Textarea value={amountDiscount} disabled />
              </FormControl>
            </Stack>
          </Stack>
          {!openEdit && (
            <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 3 }}>
              <Button
                className="ml-4 bg-button-primary"
                size="sm"
                onClick={() => setIsSelectModalOpen(true)}
                disabled={selectedSupplier === null || isEditDisabled}
              >
                Fill Up SDR Table
              </Button>
            </Stack>
          )}
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="ml-5 grid grid-cols-3">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>FOB Total</FormLabel>
              <h5>{`${currencyUsed} ${fobTotal.toFixed(2)}`}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>NET Amount</FormLabel>
              <h5>{`${currencyUsed} ${netAmount.toFixed(2)}`}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>LANDED Total</FormLabel>
              <h5>{`${currencyUsed} ${(landedTotal / pesoRate).toFixed(2)}`}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>FOB Total</FormLabel>
              <h5>₱{(fobTotal * pesoRate).toFixed(2)}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>NET Amount</FormLabel>
              <h5>₱{(netAmount * pesoRate).toFixed(2)}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>LANDED Total</FormLabel>
              <h5>₱{landedTotal.toFixed(2)}</h5>
            </FormControl>

            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>% NET Cost</FormLabel>
              <h5>{percentNetCost.toFixed(4)}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total Expense</FormLabel>
              <h5>₱{totalExpense.toFixed(2)}</h5>{" "}
            </FormControl>
          </div>
          <Divider />
          <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 3 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Created by</FormLabel>
              <p className="text-sm">Renzo Tan</p>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Date Created</FormLabel>
              <p className="text-sm">01/29/2024 11:55 AM</p>
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Modified by</FormLabel>
              <p className="text-sm">Renzo Tan</p>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Date Modified</FormLabel>
              <p className="text-sm">01/29/2024 11:55 AM</p>
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
    </Box>
  );
};

export default RRFormDetails;
