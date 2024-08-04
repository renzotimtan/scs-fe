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
import { convertToQueryParams } from "../../../helper";

const SDRFormDetails = ({
  openEdit,
  selectedRow,
  suppliers,
  selectedPOs,
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
  pesoRate,
  currencyUsed,

  // Summary Amounts
  fobTotal,
  netAmount,
  landedTotal,
  amountDiscount,
  setAmountDiscount,
}: SDRFormDetailsProps): JSX.Element => {
  const [unservedPOs, setUnservedPOs] = useState<PurchaseOrder[]>([]);
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false);

  const isAmtDiscountAlreadyApplied = (PO: PurchaseOrder): boolean => {
    for (const POItem of PO.items) {
      // If on stock increased, meaning this PO has already been handled before
      if (POItem.on_stock > 0 || POItem.allocated > 0 || POItem.available > 0)
        return true;
    }
    return false;
  };

  const getFixedAmtDiscounts = (): void => {
    let total = 0;

    for (const PO of selectedPOs) {
      // Check if this is not the first SDR with this PO
      // to apply the amount discount
      if (isAmtDiscountAlreadyApplied(PO)) {
        continue;
      }

      if (!PO.supplier_discount_1.includes("%"))
        total += Number(PO.supplier_discount_1);

      if (!PO.supplier_discount_2.includes("%"))
        total += Number(PO.supplier_discount_2);

      if (!PO.supplier_discount_3.includes("%"))
        total += Number(PO.supplier_discount_3);

      if (!PO.transaction_discount_1.includes("%"))
        total += Number(PO.transaction_discount_1);

      if (!PO.transaction_discount_2.includes("%"))
        total += Number(PO.transaction_discount_2);

      if (!PO.transaction_discount_3.includes("%"))
        total += Number(PO.transaction_discount_3);
    }

    setAmountDiscount(total);
  };

  useEffect(() => {
    if (selectedSupplier !== null && selectedSupplier !== undefined) {
      axiosInstance
        .get<PurchaseOrder[]>(
          `/api/purchase-orders/${selectedSupplier.supplier_id}`,
        )
        .then((response) =>
          setUnservedPOs(response.data.filter((PO) => PO.status === "posted")),
        )
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedSupplier]);

  useEffect(() => {
    if (!openEdit) getFixedAmtDiscounts();
  }, [selectedPOs]);

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
                disabled={selectedSupplier === null}
              >
                Fill Up PO Item Table
              </Button>
            </Stack>
          )}
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="flex justify-around">
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
              <h5>{`${currencyUsed} ${(landedTotal / pesoRate || 0).toFixed(2)}`}</h5>
            </FormControl>
          </div>
          <div className="flex justify-around">
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
              minRows={5}
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
