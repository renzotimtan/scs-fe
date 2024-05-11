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
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import Table from "@mui/joy/Table";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import { AVAILABLE_CURRENCIES } from "../../constants";

import type {
  PurchaseOrderFormProps,
  Supplier,
  Item,
  PaginatedSuppliers,
} from "../../interface";

//  Initialize state of selectedItems outside of component to avoid creating new object on each render
const INITIAL_SELECTED_ITEMS = [{ id: null }];

const PurchaseOrderForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  setSelectedRow,
  title,
}: PurchaseOrderFormProps): JSX.Element => {
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
  const [pesoRate, setPesoRate] = useState<number>(56);
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState<number>(0);
  const [status, setStatus] = useState("pending");
  const [transactionDate, setTransactionDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");

  return (
    <form>
      <div className="flex justify-between">
        <h2 className="mb-6">{title}</h2>
      </div>
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
            {openEdit && <Divider />}
            <FormControl size="sm" sx={{ mb: 1, mt: 1 }}>
              <FormLabel>From Warehouse</FormLabel>
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
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>RR Transfer</FormLabel>
                <Select size="sm" defaultValue={"yes"}>
                  <Option value="yes">Yes</Option>
                  <Option value="no">No</Option>
                </Select>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>RR No.</FormLabel>
                <Select size="sm">
                  <Option value="pending">Pending</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="cancelled">Cancelled</Option>
                  <Option value="draft">Draft</Option>
                </Select>
              </FormControl>
            </Stack>
          </div>
        </Card>
        <Card className="w-[40%]">
          <div>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
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
              <FormLabel>Remarks</FormLabel>
              <Textarea
                minRows={7}
                placeholder="Remarks"
                onChange={(e) => setRemarks(e.target.value)}
                value={remarks}
                required
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
              <th style={{ width: 150 }}>Total Quantity</th>
              <th style={{ width: 150 }}>Whse 1</th>
              <th style={{ width: 150 }}>Whse 1 Qty.</th>
              <th style={{ width: 150 }}>Whse 2</th>
              <th style={{ width: 150 }}>Whse 2 Qty.</th>
              <th style={{ width: 150 }}>Whse 3</th>
              <th style={{ width: 150 }}>Whse 3 Qty.</th>
              <th
                aria-label="last"
                style={{ width: "var(--Table-lastColumnWidth)" }}
              />
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((selectedItem: Item, index: number) => (
              <tr key={`${selectedItem.id}-${index}`}>
                <td style={{ zIndex: 1 }}>
                  <Select
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
                  {/* {selectedItem?.id !== null && ( */}
                  <Select size="sm">
                    <Option value="pending">Pending</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="cancelled">Cancelled</Option>
                    <Option value="draft">Draft</Option>
                  </Select>
                  {/* )} */}
                </td>
                <td style={{ zIndex: 2 }}>
                  {/* {selectedItem?.id !== null && ( */}
                  <Input
                    type="number"
                    slotProps={{
                      input: {
                        min: 0,
                      },
                    }}
                  />
                  {/* )} */}
                </td>
                <td>
                  <Select size="sm">
                    <Option value="pending">Pending</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="cancelled">Cancelled</Option>
                    <Option value="draft">Draft</Option>
                  </Select>
                </td>
                <td>
                  <Input
                    type="number"
                    slotProps={{
                      input: {
                        min: 0,
                      },
                    }}
                  />
                </td>
                <td>
                  <Select size="sm">
                    <Option value="pending">Pending</Option>
                    <Option value="completed">Completed</Option>
                    <Option value="cancelled">Cancelled</Option>
                    <Option value="draft">Draft</Option>
                  </Select>
                </td>
                <td>
                  <Input
                    type="number"
                    slotProps={{
                      input: {
                        min: 0,
                      },
                    }}
                  />
                </td>
                <td>
                  {selectedItem?.id !== null && (
                    <Button
                      size="sm"
                      variant="soft"
                      color="danger"
                      className="bg-delete-red"
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
