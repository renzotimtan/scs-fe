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
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import Table from "@mui/joy/Table";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";

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

const PurchaseOrderForm = (): JSX.Element => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [items, setItems] = useState<Item[]>([]);
  const [currencyUsed, setCurrencyUsed] = useState<string>("USD");
  const [supplierDiscount, setSupplierDiscount] = useState<number>(0);
  const [transactionDiscount, setTransactionDiscount] = useState<number>(0);
  const [pesoRate, setPesoRate] = useState<number>(56);

  useEffect(() => {
    // Fetch suppliers
    axiosInstance
      .get<Supplier[]>("/api/suppliers/")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  useEffect(() => {
    if (selectedSupplier !== null) {
      // Fetch items for the selected supplier
      axiosInstance
        .get<Item[]>(`/api/items?supplier_id=${selectedSupplier.supplier_id}`)
        .then((response) => setItems(response.data))
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedSupplier]);

  // Calculations
  const fobTotal = items.reduce(
    (acc, item) => acc + item.total_available * item.acquisition_cost,
    0,
  );
  const supplierDiscountAmount = (supplierDiscount / 100) * fobTotal;
  const transactionDiscountAmount = (transactionDiscount / 100) * fobTotal;
  const netAmount =
    fobTotal - supplierDiscountAmount - transactionDiscountAmount;
  const landedTotal = netAmount * pesoRate;

  return (
    <div>
      <h2 className="mb-6">Create Purchase Order</h2>
      <Box sx={{ display: "flex" }}>
        <Card className="w-[60%] mr-7">
          <div>
            <div className="flex justify-between items-center">
              <FormControl size="sm" sx={{ mb: 1 }}>
                <FormLabel>Purchase Order No.</FormLabel>
                <h5>12345</h5>
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
                />
              </div>
            </FormControl>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>Status</FormLabel>
                <Select size="sm" placeholder="Unposted">
                  <Option value="unposted">Unposted</Option>
                  <Option value="posted">Posted</Option>
                  <Option value="posted">Cancelled</Option>
                </Select>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>Transaction Date</FormLabel>
                <Input type="date" />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>Supplier Discount</FormLabel>
                <Input
                  endDecorator="%"
                  size="sm"
                  placeholder="55"
                  value={supplierDiscount}
                  onChange={(e) => setSupplierDiscount(Number(e.target.value))}
                />
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>Transaction Discount</FormLabel>
                <Input
                  endDecorator="%"
                  size="sm"
                  placeholder="55"
                  value={transactionDiscount}
                  onChange={(e) =>
                    setTransactionDiscount(Number(e.target.value))
                  }
                />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>Currency Used</FormLabel>
                <Select size="sm" placeholder="USD">
                  <Option value="USD">USD</Option>
                  <Option value="AUD">AUD</Option>
                </Select>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "48%" }}>
                <FormLabel>Philippine Peso Rate</FormLabel>
                <Input
                  startDecorator="₱"
                  size="sm"
                  placeholder="55"
                  value={pesoRate}
                  onChange={(e) => setPesoRate(Number(e.target.value))}
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
              <Input size="sm" placeholder="Search" />
            </FormControl>
            <FormControl size="sm" sx={{ mb: 3 }}>
              <FormLabel>Remarks</FormLabel>
              <Textarea minRows={1} placeholder="Search" />
            </FormControl>
          </div>
        </Card>
      </Box>
      <div className="overflow-x-auto">
        <Table className="mt-6">
          <thead>
            <tr>
              <th>Stock Code</th>
              <th>Name</th>
              <th>Current Price</th>
              <th>Volume</th>
              <th>Price</th>
              <th>Gross</th>
              <th>Created By</th>
              <th>Date Created</th>
              <th>Modified By</th>
              <th>Date Modified</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.stock_code}</td>
                <td>{item.name}</td>
                <td>{item.acquisition_cost}</td>
                <td>{item.total_on_stock}</td>
                <td>{item.acquisition_cost}</td>
                <td>
                  {Number(item.total_available) * Number(item.acquisition_cost)}
                </td>
                <td>{item.creator.username}</td>
                <td>{item.date_created}</td>
                <td>{item.modifier?.username}</td>
                <td>{item?.date_modified}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Divider />
        <div className="flex justify-end mt-4">
          <Button className="ml-4 w-[130px]" size="sm" variant="outlined">
            <DoDisturbIcon className="mr-2" />
            Cancel
          </Button>
          <Button className="ml-4 w-[130px] bg-button-primary" size="sm">
            <SaveIcon className="mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrderForm;
