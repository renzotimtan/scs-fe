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
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import type { PurchaseOrder } from "../../pages/purchasing/purchase-order";
import { toast } from "react-toastify";
import { AVAILABLE_CURRENCIES } from "../../constants";

const INITIAL_DISCOUNTS = {
  supplier: ["0", "0", "0"],
  transaction: ["0", "0", "0"],
};

type DiscountType = "supplier" | "transaction";

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
  volume?: number;
  price?: number;
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

interface DeliveryReceiptFormProps {
  setOpen: (isOpen: boolean) => void;
  openCreate: boolean;
  openEdit: boolean;
  selectedRow?: PurchaseOrder;
  setSelectedRow?: (purchaseOrder: PurchaseOrder) => void;
  title: string;
}

interface PaginatedSuppliers {
  total: number;
  items: Supplier[];
}

//  Initialize state of selectedItems outside of component to avoid creating new object on each render
const INITIAL_SELECTED_ITEMS = [{ id: null }];

const DeliveryReceiptForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  setSelectedRow,
  title,
}: DeliveryReceiptFormProps): JSX.Element => {
  const [suppliers, setSuppliers] = useState<PaginatedSuppliers>({
    total: 0,
    items: [],
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<any>(
    INITIAL_SELECTED_ITEMS,
  );
  const [currencyUsed, setCurrencyUsed] = useState<string>("USD");
  const [discounts, setDiscounts] = useState(INITIAL_DISCOUNTS);
  const [pesoRate, setPesoRate] = useState<number>(56);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState<number>(0);
  const [status, setStatus] = useState("pending");
  const [transactionDate, setTransactionDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  useEffect(() => {
    // Fetch suppliers
    axiosInstance
      .get<PaginatedSuppliers>("/api/suppliers/")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleDiscountChange = (
    type: DiscountType,
    index: number,
    value: string,
  ): void => {
    const newDiscounts = { ...discounts };
    newDiscounts[type][index] = value;
    setDiscounts(newDiscounts);
  };

  const areDiscountsValid = (): boolean => {
    const isSupplierValid = discounts.supplier.every((str) =>
      /^(\d+|\d+%?)$/.test(str),
    );
    const isTransactionValid = discounts.transaction.every((str) =>
      /^(\d+|\d+%?)$/.test(str),
    );

    return isSupplierValid && isTransactionValid;
  };

  const calculateDiscount = (discountStr: string, total: number): number => {
    if (discountStr.trim() === "") return 0;
    if (discountStr.includes("%")) {
      const percentage = parseFloat(discountStr.replace("%", ""));
      return (percentage / 100) * total;
    }
    return parseFloat(discountStr);
  };

  const calculateTotalWithDiscounts = (
    discountArray: string[],
    initialTotal: number,
  ): number => {
    return discountArray.reduce(
      (subtotal, discount) => subtotal - calculateDiscount(discount, subtotal),
      initialTotal,
    );
  };

  const fobTotal: number = selectedItems.reduce((acc: number, item: Item) => {
    // Explicitly check for a valid number on id, and ensure price and volume are greater than zero.
    if (
      typeof item.id === "number" && // Check that id is a number.
      !isNaN(item.price) &&
      item.price > 0 &&
      !isNaN(item.volume) &&
      item.volume > 0
    ) {
      return acc + item.price * item.volume;
    }
    return acc;
  }, 0);

  const subtotalAfterSupplierDiscounts = calculateTotalWithDiscounts(
    discounts.supplier,
    fobTotal,
  );
  const netAmount = calculateTotalWithDiscounts(
    discounts.transaction,
    subtotalAfterSupplierDiscounts,
  );
  const landedTotal = netAmount * pesoRate;

  const getAllPOItems = (): void => {
    const POItems = selectedRow?.items;

    // If selected supplier is different from the selected row supplier (i.e. user edited supplier)
    // make PO blank
    if (selectedRow?.supplier.supplier_id !== selectedSupplier?.supplier_id) {
      setSelectedItems(INITIAL_SELECTED_ITEMS);
      return;
    }

    const selectedItems = POItems?.map((item) => {
      const id = item.item_id;
      const foundItem = items.find((i) => i.id === id);

      const modifiedItem = {
        ...foundItem,
        price: item.price,
        volume: item.volume,
      };

      return modifiedItem;
    });

    if (selectedItems !== undefined) {
      selectedItems?.push({ id: null });
      setSelectedItems(selectedItems);
    }
  };

  useEffect(() => {
    // Set fields for Edit
    if (selectedRow !== null && selectedRow?.supplier_id !== undefined) {
      setCurrencyUsed(selectedRow?.currency_used ?? "USD");
      setDiscounts({
        supplier: [
          selectedRow?.supplier_discount_1 ?? 0,
          selectedRow?.supplier_discount_2 ?? 0,
          selectedRow?.supplier_discount_3 ?? 0,
        ],
        transaction: [
          selectedRow?.transaction_discount_1 ?? 0,
          selectedRow?.transaction_discount_2 ?? 0,
          selectedRow?.transaction_discount_3 ?? 0,
        ],
      });
      setPesoRate(selectedRow?.peso_rate ?? 56);
      setPurchaseOrderNumber(selectedRow?.purchase_order_number ?? 0);
      setStatus(selectedRow?.status ?? "pending");
      setTransactionDate(selectedRow?.transaction_date ?? "");
      setReferenceNumber(selectedRow?.reference_number ?? "");
      setRemarks(selectedRow?.remarks ?? "");

      axiosInstance
        .get<Supplier>(`/api/suppliers/${selectedRow?.supplier_id}`)
        .then((response) => {
          setSelectedSupplier(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedRow]);

  useEffect(() => {
    // Set POItems only after items exist for edit
    if (selectedRow !== undefined && items.length > 0) {
      getAllPOItems();
    }
  }, [items]);

  useEffect(() => {
    if (selectedSupplier !== null) {
      // Fetch items for the selected supplier
      axiosInstance
        .get<Item[]>(`/api/items?supplier_id=${selectedSupplier.supplier_id}`)
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedSupplier]);

  const handleCreatePurchaseOrder = async (): Promise<void> => {
    if (selectedItems.length === 1) {
      toast.error("Error: No Items Selected");
      return;
    }

    if (!areDiscountsValid()) {
      toast.error(
        "Error: Discounts must be a positive number with or without %",
      );
      return;
    }

    const itemPayload = selectedItems
      .filter((item: Item) => item.id !== null)
      .map((item: Item) => ({
        item_id: item.id,
        volume: item.volume,
        price: item.price,
        total_price: Number(item.volume) * Number(item.price),
      }));

    const payload = {
      purchase_order_number: purchaseOrderNumber,
      status,
      transaction_date: transactionDate,
      supplier_id: selectedSupplier?.supplier_id ?? 0,
      fob_total: fobTotal,
      currency_used: currencyUsed,
      supplier_discount_1: discounts.supplier[0],
      supplier_discount_2: discounts.supplier[1],
      supplier_discount_3: discounts.supplier[2],
      transaction_discount_1: discounts.transaction[0],
      transaction_discount_2: discounts.transaction[1],
      transaction_discount_3: discounts.transaction[2],
      peso_rate: pesoRate,
      net_amount: netAmount,
      reference_number: referenceNumber,
      landed_total: landedTotal,
      remarks,
      created_by: 1, // Set this based on the logged-in user
      items: itemPayload,
    };
    try {
      console.log("payload: ", payload);
      const response = await axiosInstance.post(
        "/api/purchase_orders/",
        payload,
      );
      toast.success("Save successful!");
      resetForm();
      setOpen(false);
      console.log("Response: ", response);
      // Handle the response, update state, etc.
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = (error.response.data as any)?.detail;
      toast.error(`Input Error: ${errorMessage}`);
    }
  };

  const resetForm = (): void => {
    setSelectedSupplier(null);
    setItems([]);
    setSelectedItems(INITIAL_SELECTED_ITEMS);
    setCurrencyUsed("USD");
    setDiscounts(INITIAL_DISCOUNTS);
    setPesoRate(56);
    setPurchaseOrderNumber(0);
    setStatus("pending");
    setTransactionDate("");
    setReferenceNumber("");
    setRemarks("");
  };

  const handleEditPurchaseOrder = async (): Promise<void> => {
    if (selectedItems.length === 1) {
      toast.error("Error: No Items Selected");
      return;
    }

    if (!areDiscountsValid()) {
      toast.error(
        "Error: Discounts must be a positive number with or without %",
      );
      return;
    }

    const itemPayload = selectedItems
      .filter((item: Item) => item.id !== null)
      .map((item: Item) => ({
        item_id: item.id,
        volume: item.volume,
        price: item.price,
        total_price: Number(item.volume) * Number(item.price),
      }));

    const payload = {
      purchase_order_number: purchaseOrderNumber,
      status,
      transaction_date: transactionDate,
      supplier_id: selectedSupplier?.supplier_id ?? 0,
      fob_total: fobTotal,
      currency_used: currencyUsed,
      supplier_discount_1: discounts.supplier[0],
      supplier_discount_2: discounts.supplier[1],
      supplier_discount_3: discounts.supplier[2],
      transaction_discount_1: discounts.transaction[0],
      transaction_discount_2: discounts.transaction[1],
      transaction_discount_3: discounts.transaction[2],
      peso_rate: pesoRate,
      net_amount: netAmount,
      reference_number: referenceNumber,
      landed_total: landedTotal,
      remarks,
      modified_by: 1, // Set this based on the logged-in user
      items: itemPayload,
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
      const errorMessage = (error.response.data as any)?.detail;
      toast.error(`Input Error: ${errorMessage}`);
    }
  };

  const fetchSelectedItem = (
    event: any,
    value: number,
    index: number,
  ): void => {
    if (value !== undefined) {
      const item = items.find((item) => item.id === value);

      if (item !== undefined) {
        // default to cost and 1 unit
        item.price = item?.acquisition_cost;
        item.volume = 1;
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
        <h2 className="mb-6">{title}</h2>
      </div>
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
              <FormLabel>Supplier</FormLabel>
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
              {discounts.supplier.map((discount, index) => (
                <Stack
                  key={`discount-row-${index}`}
                  direction="row"
                  spacing={2}
                >
                  <FormControl size="sm" sx={{ width: "48%" }}>
                    <FormLabel>{`Supplier Discount ${index + 1}`}</FormLabel>
                    <Input
                      value={discount}
                      onChange={(e) =>
                        handleDiscountChange("supplier", index, e.target.value)
                      }
                      placeholder="Enter % or actual discount"
                      disabled
                      required
                    />
                  </FormControl>
                  <FormControl size="sm" sx={{ width: "48%" }}>
                    <FormLabel>{`Transaction Discount ${index + 1}`}</FormLabel>
                    <Input
                      value={discounts.transaction[index]}
                      onChange={(e) =>
                        handleDiscountChange(
                          "transaction",
                          index,
                          e.target.value,
                        )
                      }
                      placeholder="Enter % or actual discount"
                      disabled
                      required
                    />
                  </FormControl>
                </Stack>
              ))}
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
                minRows={4}
                placeholder="Remarks"
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
              <th style={{ width: 150 }}>PO Volume</th>
              <th style={{ width: 150 }}>Price</th>
              <th style={{ width: 150 }}>Unsrv. Quantity</th>
              <th style={{ width: 150 }}>Srv. Quantity</th>
              <th style={{ width: 150 }}>Supp. Disc</th>
              <th style={{ width: 150 }}>Tran. Disc</th>
              <th style={{ width: 150 }}>Gross</th>
              <th style={{ width: 150 }}>Currency</th>
              <th style={{ width: 150 }}>Rate</th>

              <th
                aria-label="last"
                style={{ width: "var(--Table-lastColumnWidth)" }}
              />
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((selectedItem: Item, index: number) => (
              <tr key={`${selectedItem.id}-${selectedItem.volume}`}>
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
                <td>0</td>
                <td style={{ zIndex: 2 }}>
                  {selectedItem?.id !== null && (
                    <Input
                      type="number"
                      onChange={(e) =>
                        addItemVolume(Number(e.target.value), index)
                      }
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      value={selectedItem.volume}
                      required
                    />
                  )}
                </td>
                <td style={{ zIndex: 2 }}>
                  {selectedItem?.id !== null && (
                    <Input
                      type="number"
                      value={selectedItem.price}
                      slotProps={{
                        input: {
                          min: 0,
                        },
                      }}
                      onChange={(e) =>
                        addItemPrice(Number(e.target.value), index)
                      }
                    />
                  )}
                </td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>
                  {selectedItem?.id !== null &&
                    Number(selectedItem?.price) * Number(selectedItem?.volume)}
                </td>
                <td>0</td>
                <td>0</td>

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

export default DeliveryReceiptForm;
