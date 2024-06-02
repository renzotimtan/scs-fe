import RRFormDetails from "./RRForm/RRFormDetails";
import RRFormTable from "./RRForm/RRFormTable";
import RRFormExpenses from "./RRForm/RRFormExpenses";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
// import { toast } from "react-toastify";
import type { User } from "../../pages/Login";
import type {
  Supplier,
  PaginatedSuppliers,
  RRFormProps,
  DeliveryReceipt,
} from "../../interface";

const ReceivingReportForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: RRFormProps): JSX.Element => {
  const [suppliers, setSuppliers] = useState<PaginatedSuppliers>({
    total: 0,
    items: [],
  });
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );
  const [selectedSDRs, setSelectedSDRs] = useState<DeliveryReceipt[]>([]);
  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [pesoRate, setPesoRate] = useState<number>(56);
  const [currencyUsed, setCurrencyUsed] = useState<string>("USD");
  const [amountDiscount, setAmountDiscount] = useState(0);
  const [totalGross, setTotalGross] = useState(0);
  const [totalNet, setTotalNet] = useState(0);
  const [servedAmt, setServedAmt] = useState<Record<string, number>>({});
  const [totalExpense, setTotalExpense] = useState(0);

  const fobTotal = totalGross;
  const netAmount = totalNet;
  const landedTotal = netAmount * pesoRate;
  const percentNetCost = isNaN(totalExpense / landedTotal)
    ? 0
    : totalExpense / landedTotal;

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

  useEffect(() => {
    // Set fields for Edit
    const supplierID = selectedRow?.supplier_id;

    if (selectedRow !== null && selectedRow !== undefined) {
      setStatus(selectedRow?.status ?? "unposted");
      setTransactionDate(selectedRow?.transaction_date ?? "");
      setReferenceNumber(selectedRow?.reference_number ?? "");
      setRemarks(selectedRow?.remarks ?? "");
      setSelectedSDRs(selectedRow?.sdrs);

      // Get Fixed Discounts and sum them
      const totalDiscount = 0;
      selectedRow.sdrs.forEach((sdr) => {
        sdr.discount_amount += totalDiscount;
      });
      setAmountDiscount(totalDiscount);

      // Get Supplier for Edit
      axiosInstance
        .get<Supplier>(`/api/suppliers/${supplierID}`)
        .then((response) => {
          setSelectedSupplier(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedRow]);

  // const resetForm = (): void => {
  //   setSelectedSupplier(null);
  //   setSelectedSDRs([]);
  //   setStatus("unposted");
  //   setPesoRate(56);
  //   setCurrencyUsed("USD");
  //   setTransactionDate("");
  //   setReferenceNumber("");
  //   setRemarks("");
  //   setAmountDiscount(0);
  // };

  // const handleCreateDeliveryReceipt = async (): Promise<void> => {
  //   const payload = {
  //     sdr_data: {
  //       status,
  //       transaction_date: transactionDate,
  //       fob_total: fobTotal,
  //       net_amount: netAmount,
  //       landed_total: landedTotal,
  //       reference_number: referenceNumber,
  //       remarks,
  //       created_by: userId,
  //     },
  //     items_data: selectedPOs.flatMap((PO, index1) =>
  //       PO.items.map((POItem, index2) => {
  //         const key = `${PO.id}-${POItem.id}-${index1}-${index2}`;
  //         return {
  //           purchase_order_id: PO.id,
  //           item_id: POItem.item_id,
  //           volume: POItem.volume,
  //           price: POItem.price,
  //           total_price: POItem.total_price,
  //           id: POItem.id,
  //           unserved_spo: POItem.unserved_spo - servedAmt[key],
  //           on_stock: servedAmt[key],
  //           available: POItem.available,
  //           allocated: POItem.allocated,
  //         };
  //       }),
  //     ),
  //   };

  //   try {
  //     await axiosInstance.post("/api/supplier-delivery-receipts/", payload);
  //     toast.success("Save successful!");
  //     resetForm();
  //     setOpen(false);
  //     // Handle the response, update state, etc.
  //   } catch (error: any) {
  //     toast.error(`Error message: ${error?.response?.data?.detail[0]?.msg}`);
  //   }
  // };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        // if (openCreate) await handleCreateDeliveryReceipt();
      }}
    >
      <div className="flex justify-between">
        <h2 className="mb-6">{title}</h2>
      </div>
      <RRFormDetails
        openEdit={openEdit}
        selectedRow={selectedRow}
        suppliers={suppliers}
        // Fields
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        selectedSDRs={selectedSDRs}
        setSelectedSDRs={setSelectedSDRs}
        status={status}
        setStatus={setStatus}
        pesoRate={pesoRate}
        setPesoRate={setPesoRate}
        currencyUsed={currencyUsed}
        setCurrencyUsed={setCurrencyUsed}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        remarks={remarks}
        setRemarks={setRemarks}
        referenceNumber={referenceNumber}
        setReferenceNumber={setReferenceNumber}
        amountDiscount={amountDiscount}
        setAmountDiscount={setAmountDiscount}
        // Summary Amounts
        fobTotal={fobTotal}
        netAmount={netAmount}
        landedTotal={landedTotal}
        totalExpense={totalExpense}
        percentNetCost={percentNetCost}
      />
      <RRFormTable
        selectedSDRs={selectedSDRs}
        setSelectedSDRs={setSelectedSDRs}
        totalNet={totalNet}
        servedAmt={servedAmt}
        setServedAmt={setServedAmt}
        setTotalNet={setTotalNet}
        setTotalGross={setTotalGross}
        openEdit={openEdit}
      />
      <Divider />
      <RRFormExpenses
        selectedSDRs={selectedSDRs}
        setTotalExpense={setTotalExpense}
      />
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

export default ReceivingReportForm;
