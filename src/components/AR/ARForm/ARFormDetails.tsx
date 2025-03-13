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
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import {
  formatToDateTime,
  addCommaToNumberWithFourPlaces,
  convertToQueryParams,
} from "../../../helper";
import SelectCDRModal from "./SelectCDRModal";
import { type PaginatedCDR, type CDR } from "../../../interface";

const ARFormDetails = ({
  openEdit,
  selectedRow,
  customers,
  formattedDRs,
  setFormattedDRs,
  selectedCustomer,
  setSelectedCustomer,
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
  bankName,
  setBankName,
}: ARFormDetailsProps): JSX.Element => {
  const [CDRs, setCDRs] = useState<CDR[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  useEffect(() => {
    if (selectedCustomer !== null && selectedCustomer !== undefined) {
      const params = {
        customer_id: selectedCustomer.customer_id,
        status: "posted",
      };

      axiosInstance
        .get<PaginatedCDR>(
          `/api/delivery-receipts/?${convertToQueryParams(params)}`,
        )
        .then((response) => setCDRs(response.data.items))
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedCustomer]);

  return (
    <Box sx={{ display: "flex" }}>
      <SelectCDRModal
        open={isSelectModalOpen}
        setOpen={setIsSelectModalOpen}
        CDRs={CDRs}
        setFormattedDRs={setFormattedDRs}
      />
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>Return No. {selectedRow?.id}</h4>
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
                    setFormattedDRs([]);
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
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Check Date</FormLabel>
              <Input
                type="date"
                value={checkDate}
                onChange={(e) => setCheckDate(e.target.value)}
                disabled={isEditDisabled || paymentMode !== "check"}
              />
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22%" }}>
              <FormLabel>Bank Name</FormLabel>
              <Input
                name="bankName"
                size="sm"
                placeholder="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                disabled={isEditDisabled || paymentMode !== "check"}
              />
            </FormControl>
          </Stack>
          {/* <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 1, alignItems: "flex-end" }}
          >
            {(!openEdit || status === "unposted") && (
              <Button
                sx={{ mb: 1, width: "22.5%" }}
                className="bg-button-primary"
                size="sm"
                onClick={() => setIsSelectModalOpen(true)}
                disabled={selectedCustomer === null}
              >
                Fill Table
              </Button>
            )}
          </Stack> */}
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="flex justify-around">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Payment Amount</FormLabel>
              <h5>{addCommaToNumberWithFourPlaces(123)}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total Applied</FormLabel>
              <h5>{addCommaToNumberWithFourPlaces(123)}</h5>
            </FormControl>
          </div>
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
          <Stack>
            <FormControl size="sm" sx={{ mb: 1, width: "100%" }}>
              <FormLabel>Remarks</FormLabel>
              <Textarea
                minRows={1}
                placeholder="Remarks"
                onChange={(e) => setRemarks(e.target.value)}
                value={remarks}
                disabled={isEditDisabled}
                required
              />
            </FormControl>
          </Stack>
        </div>
      </Card>
    </Box>
  );
};

export default ARFormDetails;
