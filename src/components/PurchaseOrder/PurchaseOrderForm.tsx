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
  Sheet,
} from "@mui/joy";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import Table from "@mui/joy/Table";
import { useEffect, useState, useCallback } from "react";
import axiosInstance from "../../utils/axiosConfig";
import type { PurchaseOrder } from "../../pages/purchasing/purchase-order";
import { toast } from "react-toastify";
import { AVAILABLE_CURRENCIES } from "../../constants";

interface Supplier {
  supplier_id: number;
  name: string;
}

interface Item {
  id: number;
  stock_code: string;
  name: string;
  category: string;
  brand: string;
  acquisition_cost: number;
  currency: string;
  rate: number;
  total_on_stock: number;
  total_available: number;
  total_allocated: number;
  total_purchased: number;
  total_sold: number;
  total_reorder_level: number;
  total_unserved_cpo: number;
  total_unserved_spo: number;
  volume: number;
  price: number;
  creator: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_created: string;
  modifier: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  date_modified: string;
}

interface PurchaseOrderFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: PurchaseOrder;
  setSelectedRow?: (purchaseOrder: PurchaseOrder) => void;
}

//  Initialize state of selectedItems outside of component to avoid creating new object on each render
const INITIAL_SELECTED_ITEMS = [{ id: null }];

const PurchaseOrderForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  setSelectedRow,
}: PurchaseOrderFormProps): JSX.Element => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<any>(
    INITIAL_SELECTED_ITEMS,
  );
  const [currencyUsed, setCurrencyUsed] = useState<string>("USD");
  const [supplierDiscount, setSupplierDiscount] = useState<number>(0);
  const [transactionDiscount, setTransactionDiscount] = useState<number>(0);
  const [pesoRate, setPesoRate] = useState<number>(56);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState<number>(0);
  const [status, setStatus] = useState("pending");
  const [transactionDate, setTransactionDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    // Fetch suppliers
    axiosInstance
      .get<Supplier[]>("/api/suppliers/")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (selectedRow !== null && selectedRow?.supplier_id !== undefined) {
      setCurrencyUsed(selectedRow?.currency_used ?? "USD");
      setSupplierDiscount(selectedRow?.supplier_discount ?? 0);
      setTransactionDiscount(selectedRow?.transaction_discount ?? 0);
      setPesoRate(selectedRow?.peso_rate ?? 56);
      setPurchaseOrderNumber(selectedRow?.purchase_order_number ?? 0);
      setStatus(selectedRow?.status ?? "pending");
      setTransactionDate(selectedRow?.transaction_date ?? "");
      setReferenceNumber(selectedRow?.reference_number ?? "");
      setRemarks(selectedRow?.remarks ?? "");

      axiosInstance
        .get<Supplier>(`/api/suppliers/${selectedRow?.supplier_id}`)
        .then((response) => setSelectedSupplier(response.data))
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedRow]);

  useEffect(() => {
    if (selectedSupplier !== null) {
      // Fetch items for the selected supplier
      axiosInstance
        .get<Item[]>(`/api/items?supplier_id=${selectedSupplier.supplier_id}`)
        .then((response) => setItems(response.data))
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedSupplier]);

  const resetSelectedItems = useCallback(() => {
    setSelectedItems(INITIAL_SELECTED_ITEMS);
  }, []);

  useEffect(() => {
    resetSelectedItems();
  }, [selectedSupplier]);

  // Calculations
  const fobTotal = selectedItems.reduce((acc: number, item: Item) => {
    let itemCost;

    if (item?.price !== undefined) {
      itemCost = item.price;
    } else if (item?.acquisition_cost !== undefined) {
      itemCost = item.acquisition_cost;
    } else {
      itemCost = 0;
    }

    const itemAvailable = item.volume ?? 0;
    return acc + itemAvailable * itemCost;
  }, 0);

  const supplierDiscountAmount = (supplierDiscount / 100) * fobTotal;
  const transactionDiscountAmount = (transactionDiscount / 100) * fobTotal;
  const netAmount =
    fobTotal - supplierDiscountAmount - transactionDiscountAmount;
  const landedTotal = netAmount * pesoRate;

  const handleCreatePurchaseOrder = async (): Promise<void> => {
    if (selectedItems.length === 1) {
      toast.error("Error: No Items Selected");
      return;
    }

    const payload = {
      purchase_order_number: purchaseOrderNumber,
      status,
      transaction_date: transactionDate,
      supplier_id: selectedSupplier?.supplier_id ?? 0,
      fob_total: fobTotal,
      currency_used: currencyUsed,
      supplier_discount: supplierDiscount,
      transaction_discount: transactionDiscount,
      peso_rate: pesoRate,
      net_amount: netAmount,
      reference_number: referenceNumber,
      landed_total: landedTotal,
      remarks,
      created_by: 1, // Set this based on the logged-in user
    };
    try {
      console.log("payload: ", payload);
      const response = await axiosInstance.post(
        "/api/purchase_orders/",
        payload,
      );
      toast.success("Save successful!");
      setOpen(false);
      console.log("Response: ", response);
      // Handle the response, update state, etc.
    } catch (error) {
      console.error("Error:", error);
      // toast.error("Error:", error);
    }
  };

  const handleEditPurchaseOrder = async (): Promise<void> => {
    const payload = {
      purchase_order_number: purchaseOrderNumber,
      status,
      transaction_date: transactionDate,
      supplier_id: selectedSupplier?.supplier_id ?? 0,
      fob_total: fobTotal,
      currency_used: currencyUsed,
      supplier_discount: supplierDiscount,
      transaction_discount: transactionDiscount,
      peso_rate: pesoRate,
      net_amount: netAmount,
      reference_number: referenceNumber,
      landed_total: landedTotal,
      remarks,
      modified_by: 1, // Set this based on the logged-in user
    };
    try {
      console.log("payload: ", payload);
      const response = await axiosInstance.put(
        `/api/purchase_orders/${selectedRow?.id}`,
        payload,
      );
      setOpen(false);
      toast.success("Save successful!");
      console.log("Response: ", response);
      // Handle the response, update state, etc.
    } catch (error) {
      console.error("Error:", error);
      // toast.error("Error:", error);
    }
  };

  const fetchSelectedItem = (event, value: number, index: number): void => {
    if (value !== undefined) {
      const item = items.find((item) => item.id === value);

      const hasBeenAdded = selectedItems.find(
        (selectedItem: Item) => selectedItem.id === item?.id,
      );

      if (hasBeenAdded !== undefined) {
        toast.error("Error: The item has already been added");
        return;
      }

      // We need to add the new item before the null item
      const newSelectedItems = selectedItems.filter(
        (selectedItem: Item) => selectedItem.id !== null,
      );
      newSelectedItems[index] = item;
      newSelectedItems.push({ id: null });

      setSelectedItems(newSelectedItems);
    }
  };

  const handleRemoveItem = (index: number): void => {
    if (selectedItems[index].id !== null) {
      setSelectedItems(
        selectedItems.filter((_: Item, i: number) => i !== index),
      );
    }
  };

  const addItemVolume = (value: number, index: number): void => {
    const newSelectedItems = selectedItems.map((item: Item, i: number) => {
      if (i === index) {
        return { ...item, volume: value };
      }

      return item;
    });

    setSelectedItems(newSelectedItems);
  };

  const addItemPrice = (value: number, index: number): void => {
    const newSelectedItems = selectedItems.map((item: Item, i: number) => {
      if (i === index) {
        return { ...item, price: value };
      }

      return item;
    });

    setSelectedItems(newSelectedItems);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (openCreate) await handleCreatePurchaseOrder();
        if (openEdit) await handleEditPurchaseOrder();
      }}
    >
      <div className="flex justify-between">
        <h2 className="mb-6">Create Purchase Order</h2>
      </div>
      <Box sx={{ display: "flex" }}>
        <Card className="w-[60%] mr-7">
          <div>
            <div className="flex justify-between items-center">
              <FormControl size="sm" sx={{ mb: 1 }}>
                <FormLabel>Purchase Order No.</FormLabel>
                <Input
                  size="sm"
                  type="number"
                  placeholder="12345"
                  value={purchaseOrderNumber}
                  onChange={(e) =>
                    setPurchaseOrderNumber(Number(e.target.value))
                  }
                  required
                />
              </FormControl>
              <Button
                className="ml-4 w-[130px] h-[35px] bg-button-neutral"
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
                  options={suppliers}
                  getOptionLabel={(option) => option.name}
                  value={selectedSupplier}
                  onChange={(event, newValue) => {
                    setSelectedSupplier(newValue);
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
                <FormLabel>Supplier Discount</FormLabel>
                <Input
                  endDecorator="%"
                  type="number"
                  size="sm"
                  placeholder="55"
                  value={supplierDiscount}
                  onChange={(e) => setSupplierDiscount(Number(e.target.value))}
                  required
                />
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>Transaction Discount</FormLabel>
                <Input
                  endDecorator="%"
                  type="number"
                  size="sm"
                  placeholder="55"
                  value={transactionDiscount}
                  onChange={(e) =>
                    setTransactionDiscount(Number(e.target.value))
                  }
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
                  required
                />
              </FormControl>
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
              />
            </FormControl>
            <FormControl size="sm" sx={{ mb: 3 }}>
              <FormLabel>Remarks</FormLabel>
              <Textarea
                minRows={1}
                placeholder="Search"
                onChange={(e) => setRemarks(e.target.value)}
                value={remarks}
              />
            </FormControl>
          </div>
        </Card>
      </Box>
      <Sheet
        sx={{
          "--TableCell-height": "40px",
          // the number is the amount of the header rows.
          "--TableHeader-height": "calc(1 * var(--TableCell-height))",
          "--Table-firstColumnWidth": "150px",
          "--Table-lastColumnWidth": "86px",
          // background needs to have transparency to show the scrolling shadows
          "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
          "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
          overflow: "auto",
          borderRadius: 8,
          marginTop: 3,
          background: (
            theme,
          ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
              linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
              radial-gradient(
                farthest-side at 0 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              ),
                0 100%`,
          backgroundSize:
            "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "local, local, scroll, scroll",
          backgroundPosition:
            "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
          backgroundColor: "background.surface",
          maxHeight: "600px",
        }}
      >
        <Table
          className="h-5"
          sx={{
            "& tr > *:first-child": {
              position: "sticky",
              left: 0,
              boxShadow: "1px 0 var(--TableCell-borderColor)",
              bgcolor: "background.surface",
            },
            "& tr > *:last-child": {
              position: "sticky",
              right: 0,
              bgcolor: "var(--TableCell-headBackground)",
            },
          }}
          borderAxis="both"
        >
          <thead>
            <tr>
              <th
                style={{
                  width: "var(--Table-firstColumnWidth)",
                }}
              >
                Selected Item
              </th>
              <th style={{ width: 300 }}>Stock Code</th>
              <th style={{ width: 300 }}>Name</th>
              <th style={{ width: 150 }}>Current Price</th>
              <th style={{ width: 150 }}>Volume</th>
              <th style={{ width: 150 }}>Price</th>
              <th style={{ width: 150 }}>Gross</th>
              <th style={{ width: 200 }}>Created By</th>
              <th style={{ width: 250 }}>Date Created</th>
              <th style={{ width: 200 }}>Modified By</th>
              <th style={{ width: 250 }}>Date Modified</th>
              <th
                aria-label="last"
                style={{ width: "var(--Table-lastColumnWidth)" }}
              />
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((selectedItem: Item, index: number) => (
              <tr key={selectedItem.id}>
                <td style={{ zIndex: 1 }}>
                  <Select
                    onChange={(event, value) => {
                      if (value !== null) {
                        fetchSelectedItem(event, value, index);
                      }
                    }}
                    className="mt-1 border-0"
                    size="sm"
                    placeholder="Select Item"
                    value={selectedItem.id}
                  >
                    {items.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </td>
                <td>{selectedItem?.stock_code}</td>
                <td>{selectedItem?.name}</td>
                <td>{selectedItem?.acquisition_cost}</td>
                <td style={{ zIndex: 2 }}>
                  {selectedItem?.id !== null && (
                    <Input
                      type="number"
                      onChange={(e) =>
                        addItemVolume(Number(e.target.value), index)
                      }
                      required
                    />
                  )}
                </td>
                <td style={{ zIndex: 2 }}>
                  {selectedItem?.id !== null && (
                    <Input
                      type="number"
                      onChange={(e) =>
                        addItemPrice(Number(e.target.value), index)
                      }
                    />
                  )}
                </td>
                <td>
                  {selectedItem?.id !== null &&
                    Number(selectedItem?.total_available) *
                      Number(selectedItem?.acquisition_cost)}
                </td>
                <td>{selectedItem?.creator?.username}</td>
                <td>{selectedItem?.date_created}</td>
                <td>{selectedItem?.modifier?.username}</td>
                <td>{selectedItem?.date_modified}</td>
                <td>
                  {selectedItem?.id !== null && (
                    <Button
                      size="sm"
                      variant="soft"
                      color="danger"
                      className="bg-delete-red"
                      onClick={() => handleRemoveItem(index)}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>
      <Divider />
      <div className="flex justify-end mt-4">
        <Button
          className="ml-4 w-[130px]"
          size="sm"
          variant="outlined"
          onClick={() => {
            setOpen(false);
          }}
        >
          <DoDisturbIcon className="mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          className="ml-4 w-[130px] bg-button-primary"
          size="sm"
        >
          <SaveIcon className="mr-2" />
          Save
        </Button>
      </div>
    </form>
  );
};

export default PurchaseOrderForm;
