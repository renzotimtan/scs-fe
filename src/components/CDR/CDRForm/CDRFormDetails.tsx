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
import type { CDRFormDetailsProps, AllocItemsFE } from "../interface";
import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosConfig";
import {
  formatToDateTime,
  addCommaToNumberWithFourPlaces,
} from "../../../helper";
import { type CDP } from "../../../interface";

const CDRFormDetails = ({
  openEdit,
  selectedRow,
  customers,
  formattedAllocs,
  setFormattedAllocs,
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
  totalNet,
  totalGross,
  totalItems,
  amountDiscount,
  setAmountDiscount,
  selectedDP,
  setSelectedDP,
}: CDRFormDetailsProps): JSX.Element => {
  const [unservedDPs, setUnservedDPs] = useState<CDP[]>([]);

  useEffect(() => {
    if (selectedCustomer !== null && selectedCustomer !== undefined) {
      axiosInstance
        .get<CDP[]>(
          `/api/delivery-plans/available/${selectedCustomer.customer_id}`,
        )
        .then((response) =>
          setUnservedDPs(response.data.filter((dp) => dp.status === "posted")),
        )
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedCustomer]);

  const calculateNetForRow = (
    newValue: number,
    allocItem: AllocItemsFE,
  ): number => {
    let result = newValue * allocItem.price;

    if (allocItem.customer_discount_1.includes("%")) {
      const cd1 = allocItem.customer_discount_1.slice(0, -1);
      result = result - result * (parseFloat(cd1) / 100);
    }

    if (allocItem.customer_discount_2.includes("%")) {
      const cd2 = allocItem.customer_discount_2.slice(0, -1);
      result = result - result * (parseFloat(cd2) / 100);
    }

    if (allocItem.customer_discount_3.includes("%")) {
      const cd3 = allocItem.customer_discount_3.slice(0, -1);
      result = result - result * (parseFloat(cd3) / 100);
    }

    if (allocItem.transaction_discount_1.includes("%")) {
      const td1 = allocItem.transaction_discount_1.slice(0, -1);
      result = result - result * (parseFloat(td1) / 100);
    }

    if (allocItem.transaction_discount_2.includes("%")) {
      const td2 = allocItem.transaction_discount_2.slice(0, -1);
      result = result - result * (parseFloat(td2) / 100);
    }

    if (allocItem.transaction_discount_3.includes("%")) {
      const td3 = allocItem.transaction_discount_3.slice(0, -1);
      result = result - result * (parseFloat(td3) / 100);
    }

    if (isNaN(result)) return 0;

    return result;
  };

  const handleCDPChange = (newValue: CDP | null): void => {
    setSelectedDP(newValue);

    if (newValue !== null) {
      setAmountDiscount(Number(newValue?.discount_amount ?? 0));
      const formattedAllocs = newValue.delivery_plan_items.map((DPItem) => {
        const allocItem = DPItem.allocation_item;

        const itemObj = allocItem.customer_purchase_order.items.find(
          (item) => item.item_id === allocItem.item_id,
        );

        return {
          id: allocItem.allocation_id,
          stock_code: itemObj?.item.stock_code ?? "",
          name: itemObj?.item.name ?? "",
          cpo_id: allocItem.customer_purchase_order_id,
          dp_qty: String(DPItem.planned_qty),
          delivery_plan_item_id: DPItem.id,

          price: itemObj?.price ?? 0,
          gross_amount: (itemObj?.price ?? 0) * DPItem.planned_qty,
          net_amount: 0,

          customer_discount_1:
            allocItem.customer_purchase_order.customer_discount_1,
          customer_discount_2:
            allocItem.customer_purchase_order.customer_discount_2,
          customer_discount_3:
            allocItem.customer_purchase_order.customer_discount_3,

          transaction_discount_1:
            allocItem.customer_purchase_order.transaction_discount_1,
          transaction_discount_2:
            allocItem.customer_purchase_order.transaction_discount_2,
          transaction_discount_3:
            allocItem.customer_purchase_order.transaction_discount_3,
        };
      });

      const formattedAllocsWithNet = formattedAllocs.map((formattedAlloc) => {
        return {
          ...formattedAlloc,
          net_amount: calculateNetForRow(
            Number(formattedAlloc.dp_qty),
            formattedAlloc,
          ),
        };
      });

      setFormattedAllocs(formattedAllocsWithNet);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Card className="w-[60%] mr-7">
        <div>
          <div className="flex justify-between items-center mb-2">
            {openEdit && (
              <div>
                <h4>CDR No. {selectedRow?.id}</h4>
              </div>
            )}
          </div>
          {openEdit && <Divider />}

          <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 1 }}>
            <FormControl size="sm" sx={{ mb: 1, mt: 1, width: "22.5%" }}>
              <FormLabel>Customer</FormLabel>
              <div className="flex">
                <Autocomplete
                  options={customers.items}
                  getOptionLabel={(option) => option.name}
                  value={selectedCustomer}
                  onChange={(event, newValue) => {
                    setSelectedCustomer(newValue);
                    setFormattedAllocs([]);
                    setSelectedDP(null);
                  }}
                  size="sm"
                  className="w-[100%]"
                  placeholder="Select Customer"
                  disabled={isEditDisabled}
                  required
                />
              </div>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, mt: 1, width: "22.5%" }}>
              <FormLabel>CDP No.</FormLabel>
              <div className="flex">
                <Autocomplete
                  options={unservedDPs}
                  getOptionLabel={(option) => String(option.id)}
                  onChange={(e, newValue) => handleCDPChange(newValue)}
                  value={selectedDP}
                  size="sm"
                  className="w-[100%]"
                  placeholder="Select CDP"
                  disabled={isEditDisabled}
                  required
                />
              </div>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1, width: "22.5%" }}>
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
            <FormControl size="sm" sx={{ mb: 1, width: "22.5%" }}>
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
          <Stack
            direction="row"
            spacing={2}
            sx={{ mt: 1, mb: 1, alignItems: "flex-end" }}
          >
            <FormControl size="sm" sx={{ mb: 1, width: "22.5%" }}>
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
            <FormControl size="sm" sx={{ mb: 1, width: "22.5%" }}>
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
            <FormControl size="sm" sx={{ mb: 1, width: "22.5%" }}>
              <FormLabel>Amount Discount</FormLabel>
              <Textarea
                minRows={1}
                placeholder="0"
                value={selectedDP?.discount_amount ?? 0}
                disabled
              />
            </FormControl>
          </Stack>
        </div>
      </Card>
      <Card className="w-[40%]">
        <div>
          <div className="flex justify-around">
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total Items</FormLabel>
              <h5>{totalItems}</h5>{" "}
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total Gross</FormLabel>
              <h5>{`${addCommaToNumberWithFourPlaces(totalGross)}`}</h5>
            </FormControl>
            <FormControl size="sm" sx={{ mb: 1 }}>
              <FormLabel>Total NET</FormLabel>
              <h5>{`${addCommaToNumberWithFourPlaces(totalNet)}`}</h5>
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

export default CDRFormDetails;
