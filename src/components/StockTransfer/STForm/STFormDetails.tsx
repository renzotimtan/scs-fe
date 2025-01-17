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
  Autocomplete,
} from "@mui/joy";
import type { STFormDetailsProps } from "../interface";
import { formatToDateTime } from "../../../helper";
import { ReceivingReport } from "../../../interface";

const STFormDetails = ({
  openEdit,
  selectedRow,

  // Fields
  status,
  setStatus,
  transactionDate,
  setTransactionDate,
  remarks,
  setRemarks,
  rrTransfer,
  setRRTransfer,
  warehouses,
  selectedWarehouse,
  setSelectedWarehouse,
  receivingReports,
  selectedRR,
  setSelectedRR,
  suppliers,
  selectedSupplier,
  setSelectedSupplier,
  setSelectedWarehouseItems,
  warehouseItems,
  fetchMultipleItems,
  handleRRNumChange,
}: STFormDetailsProps): JSX.Element => {
  const isEditDisabled =
    selectedRow !== undefined && selectedRow?.status !== "unposted";

  const handleRRTransferChange = (value: string | null) => {
    if (value !== null) {
      if (value === "no") {
        setSelectedRR(null);
        setSelectedSupplier(null);
      } else {
        // @ts-expect-error (Item object, unless its using the empty object)
        setSelectedWarehouseItems([{ id: null }]);
      }
      setRRTransfer(value);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>STR No. {selectedRow?.id}</h4>
              </div>
            )}
          </div>

          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>Supplier</FormLabel>
              <div className="flex">
                <Autocomplete
                  options={suppliers.items}
                  getOptionLabel={(option) => option.name}
                  value={selectedSupplier}
                  onChange={(event, newValue) => {
                    setSelectedSupplier(newValue);
                    // @ts-expect-error (Item object, unless its using the empty object)
                    setSelectedWarehouseItems([{ id: null }]);
                    setSelectedRR(null);
                  }}
                  size="sm"
                  className="w-[100%]"
                  placeholder="Select Supplier"
                  disabled={isEditDisabled || rrTransfer === "no"}
                  required
                />
              </div>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>From Warehouse</FormLabel>
              <Autocomplete
                options={warehouses.items}
                getOptionLabel={(option) => option.name}
                value={selectedWarehouse}
                onChange={(event, newValue) => {
                  setSelectedWarehouse(newValue);
                  // @ts-expect-error (Item object, unless its using the empty object)
                  setSelectedWarehouseItems([{ id: null }]);
                }}
                size="sm"
                className="w-[100%]"
                placeholder="Select Warehouse"
                required
              />
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
                required
              />
            </FormControl>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>RR Transfer</FormLabel>
              <Select
                onChange={(_, value) => handleRRTransferChange(value)}
                size="sm"
                value={rrTransfer}
              >
                <Option value="yes">Yes</Option>
                <Option value="no">No</Option>
              </Select>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
              <FormLabel>RR Ref No.</FormLabel>
              <Autocomplete
                options={receivingReports.items}
                getOptionLabel={(option) => option.reference_number}
                value={selectedRR}
                onChange={(_, newValue) => {
                  if (newValue !== null) {
                    handleRRNumChange(newValue);
                  }
                }}
                size="sm"
                className="w-[100%]"
                placeholder="Select Receiving Report"
                disabled={rrTransfer === "no" || !selectedSupplier}
              />
            </FormControl>
          </Stack>
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
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
          <FormControl size="sm" sx={{ mb: 3 }}>
            <FormLabel>Remarks</FormLabel>
            <Textarea
              minRows={1}
              placeholder="Remarks"
              onChange={(e) => setRemarks(e.target.value)}
              value={remarks}
            />
          </FormControl>
        </div>
      </Card>
    </Box>
  );
};

export default STFormDetails;
