import SDRFormDetails from "./SDRForm/SDRFormDetails";
import POFormTable from "./SDRForm/SDRFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import type { User } from "../../pages/Login";
import type {
  PurchaseOrderFormProps,
  Supplier,
  PaginatedSuppliers,
  PurchaseOrder,
} from "../../interface";

const PurchaseOrderForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: PurchaseOrderFormProps): JSX.Element => {
  const [suppliers, setSuppliers] = useState<PaginatedSuppliers>({
    total: 0,
    items: [],
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [selectedPOs, setSelectedPOs] = useState<PurchaseOrder[]>([]);
  const [status, setStatus] = useState("pending");
  const [transactionDate, setTransactionDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  const [totalGross, setTotalGross] = useState(0);
  const [totalNet, setTotalNet] = useState(0);
  const [amountDiscount, setAmountDiscount] = useState(0);

  const pesoRate = selectedPOs.length > 0 ? selectedPOs[0].peso_rate : 0;
  const fobTotal = totalGross;
  const netAmount = totalNet - amountDiscount;
  const landedTotal = netAmount * pesoRate;

  useEffect(() => {
    // Fetch suppliers
    axiosInstance
      .get<PaginatedSuppliers>("/api/suppliers/")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error:", error));

    // Fetch user ID
    axiosInstance
      .get<User>("/users/me/")
      .then((response) => setUserId(response.data.id))
      .catch((error) => console.error("Error fetching user ID:", error));
  }, []);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
      }}
    >
      <div className="flex justify-between">
        <h2 className="mb-6">{title}</h2>
      </div>
      <SDRFormDetails
        openEdit={openEdit}
        selectedRow={selectedRow}
        suppliers={suppliers}
        // Fields
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        selectedPOs={selectedPOs}
        setSelectedPOs={setSelectedPOs}
        status={status}
        setStatus={setStatus}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        remarks={remarks}
        setRemarks={setRemarks}
        referenceNumber={referenceNumber}
        setReferenceNumber={setReferenceNumber}
        // Summary Amounts
        fobTotal={fobTotal}
        netAmount={netAmount}
        landedTotal={landedTotal}
        amountDiscount={amountDiscount}
        setAmountDiscount={setAmountDiscount}
      />
      <POFormTable
        selectedPOs={selectedPOs}
        setSelectedPOs={setSelectedPOs}
        totalNet={totalNet}
        setTotalNet={setTotalNet}
        setTotalGross={setTotalGross}
      />
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
