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
} from "@mui/joy";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const PurchaseOrderForm = (): JSX.Element => {
  return (
    <div className="py-12 px-24">
      <h2 className="mb-6">Create Purchase Order</h2>
      <Box sx={{ display: "flex" }}>
        <Card className="w-2/3 mr-7">
          <div>
            <div className="flex justify-between items-center">
              <FormControl size="sm" sx={{ mb: 1 }}>
                <FormLabel>Purchase Order No.</FormLabel>
                <h4>PO-12345</h4>
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
                <Input
                  size="sm"
                  placeholder="ABC Corporation"
                  className="w-[85%]"
                  disabled
                />
                <Button className="ml-4 w-[130px] bg-button-primary flex">
                  <FileDownloadIcon className="mr-2" /> Select
                </Button>
              </div>
            </FormControl>

            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Status</FormLabel>
                <Select size="sm" placeholder="Unposted">
                  <Option value="unposted">Unposted</Option>
                  <Option value="posted">Posted</Option>
                </Select>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Transaction Date</FormLabel>
                <Input type="date" />
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Currency Used</FormLabel>
                <Select size="sm" placeholder="USD">
                  <Option value="USD">USD</Option>
                  <Option value="AUD">AUD</Option>
                </Select>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Philippine Peso Rate</FormLabel>
                <Input startDecorator="₱" size="sm" placeholder="55" />
              </FormControl>
            </Stack>

            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Supplier Discount</FormLabel>
                <Input startDecorator="₱" size="sm" placeholder="55" />
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Transaction Discount</FormLabel>
                <Input startDecorator="₱" size="sm" placeholder="55" />
              </FormControl>
            </Stack>
          </div>
        </Card>
        <Card className="w-1/3">
          <div>
            <div className="flex justify-around">
              <FormControl size="sm" sx={{ mb: 1 }}>
                <FormLabel>FOB Total</FormLabel>
                <h4>₱15,000</h4>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1 }}>
                <FormLabel>NET Amount</FormLabel>
                <h4>₱15,000</h4>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1 }}>
                <FormLabel>LANDED Total</FormLabel>
                <h4>₱15,000</h4>
              </FormControl>
            </div>
            <Divider />
            <Stack direction="row" spacing={2} sx={{ mb: 1, mt: 3 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Created by</FormLabel>
                <p>Renzo Tan</p>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Date Created</FormLabel>
                <p>01/29/2024 11:55 AM</p>
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Modified by</FormLabel>
                <p>Renzo Tan</p>
              </FormControl>
              <FormControl size="sm" sx={{ mb: 1, width: "50%" }}>
                <FormLabel>Date Modified</FormLabel>
                <p>01/29/2024 11:55 AM</p>
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
        </Card>
      </Box>
    </div>
  );
};

export default PurchaseOrderForm;
