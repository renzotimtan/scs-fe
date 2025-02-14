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
import type { CDPFormDetailsProps } from "../interface";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import type { Alloc, PaginatedAlloc } from "../../../interface";
import {
  formatToDateTime,
  addCommaToNumberWithFourPlaces,
} from "../../../helper";
import SelectAllocModal from "./SelectAllocModal";

const CDPFormDetails = ({
  openEdit,
  selectedRow,
  customers,
  selectedAllocs,
  setSelectedAllocs,
  selectedCustomer,
  setSelectedCustomer,
  status,
  setStatus,
  transactionDate,
  setTransactionDate,
  remarks,
  setRemarks,
  referenceNumber,
  setReferenceNumber,
  isEditDisabled,
}: CDPFormDetailsProps): JSX.Element => {
  const [unservedAllocs, setUnservedAllocs] = useState<Alloc[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  useEffect(() => {
    if (selectedCustomer !== null && selectedCustomer !== undefined) {
      axiosInstance
        .get<PaginatedAlloc>(`/api/allocations/?sort_order=desc`)
        .then((response) =>
          setUnservedAllocs(
            response.data.items.filter((alloc) => alloc.status === "posted"),
          ),
        )
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedCustomer]);

  return (
    <Box sx={{ display: "flex" }}>
      <SelectAllocModal
        open={isSelectModalOpen}
        setOpen={setIsSelectModalOpen}
        unservedAllocs={unservedAllocs}
        setSelectedAllocs={setSelectedAllocs}
      />
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>SDR No. {selectedRow?.id}</h4>
              </div>
            )}
          </div>
          {openEdit && <Divider />}

          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, mt: 1, width: "22%" }}>
              <FormLabel>Customer</FormLabel>
              <div className="flex">
                <Autocomplete
                  options={customers.items}
                  getOptionLabel={(option) => option.name}
                  value={selectedCustomer}
                  onChange={(event, newValue) => {
                    setSelectedCustomer(newValue);
                    setSelectedAllocs([]);
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
              <FormLabel>Ref No.</FormLabel>
              <Input
                size="sm"
                placeholder="Search"
                onChange={(e) => setReferenceNumber(e.target.value)}
                value={referenceNumber}
                disabled={isEditDisabled}
                required
              />
            </FormControl>
          </Stack>
          <Stack
            direction="row"
            spacing={2}
            sx={{ mb: 1, alignItems: "flex-end" }}
          >
            <FormControl size="sm" sx={{ mb: 1, width: "46%" }}>
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
          </Stack>
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="flex justify-around">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total Items</FormLabel>
              <h5>{`${addCommaToNumberWithFourPlaces(0)}`}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total Gross</FormLabel>
              <h5>{`${addCommaToNumberWithFourPlaces(0)}`}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total NET</FormLabel>
              <h5>{`${0}`}</h5>
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
        </div>
      </Card>
    </Box>
  );
};

export default CDPFormDetails;
