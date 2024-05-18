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
import type { SDRFormDetailsProps } from "../interface";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import type { PurchaseOrder } from "../../../interface";
import SelectPOModal from "./SelectPOModal";

const SDRFormDetails = ({
  openEdit,
  selectedRow,
  suppliers,
  setSelectedPOs,

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

  // Summary Amounts
  fobTotal,
  netAmount,
  landedTotal,
}: SDRFormDetailsProps): JSX.Element => {
  const [unservedPOs, setUnservedPOs] = useState<PurchaseOrder[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  useEffect(() => {
    if (selectedSupplier !== null && selectedSupplier !== undefined) {
      axiosInstance
        .get<PurchaseOrder[]>(
          `/api/purchase-orders/${selectedSupplier.supplier_id}`,
        )
        .then((response) => setUnservedPOs(response.data))
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedSupplier]);

  return (
    <Box sx={{ display: "flex" }}>
      <SelectPOModal
        open={isSelectModalOpen}
        setOpen={setIsSelectModalOpen}
        unservedPOs={unservedPOs}
        setSelectedPOs={setSelectedPOs}
      />
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>SDR No. {selectedRow?.id}</h4>
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
                  setSelectedPOs([]);
                }}
                size="sm"
                className="w-[100%]"
                placeholder="Select Supplier"
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
                <Option value="pending">Pending</Option>
                <Option value="completed">Completed</Option>
                <Option value="cancelled">Cancelled</Option>
                <Option value="draft">Draft</Option>
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
          <Stack direction="column" spacing={2} sx={{ mb: 1 }}>
            <Stack direction="row" spacing={2}>
              <FormControl size="sm" sx={{ width: "48%" }}>
                <FormLabel>Supplier Discount</FormLabel>
                <Input
                  // value={discount}
                  // onChange={(e) =>
                  //   handleDiscountChange("supplier", index, e.target.value)
                  // }
                  value={0}
                  disabled
                />
              </FormControl>
              <FormControl size="sm" sx={{ width: "48%" }}>
                <FormLabel>Transaction Discount</FormLabel>
                <Input
                  // value={discounts.transaction[index]}
                  // onChange={(e) =>
                  //   handleDiscountChange("transaction", index, e.target.value)
                  // }
                  value={0}
                  disabled
                />
              </FormControl>
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 3 }}>
            <Button
              className="ml-4 bg-button-primary"
              size="sm"
              onClick={() => setIsSelectModalOpen(true)}
              disabled={selectedSupplier === null}
            >
              Fill Up PO Item Table
            </Button>
          </Stack>
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="flex justify-around">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>FOB Total</FormLabel>
              <h5>₱{fobTotal.toFixed(2)}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>NET Amount</FormLabel>
              <h5>₱{netAmount.toFixed(2)}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>LANDED Total</FormLabel>
              <h5>₱{landedTotal.toFixed(2)}</h5>
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
              required
            />
          </FormControl>
          <FormControl size="sm" sx={{ mb: 3 }}>
            <FormLabel>Remarks</FormLabel>
            <Textarea
              minRows={4}
              placeholder="Remarks"
              onChange={(e) => setRemarks(e.target.value)}
              value={remarks}
              required
            />
          </FormControl>
        </div>
      </Card>
    </Box>
  );
};

export default SDRFormDetails;
