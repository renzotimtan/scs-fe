import CPOFormDetails from "./CPOForm/CPOFormDetails";
import CPOFormTable from "./CPOForm/CPOFormTable";
import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import type { CPOPayload, CPOItemValues } from "./interface";
import type { User } from "../../pages/Login";
import {
  areDiscountsValid,
  calculateTotalWithDiscounts,
} from "./CPOForm/helpers";
import type {
  CPOFormProps,
  Supplier,
  Item,
  PaginatedSuppliers,
  PaginatedItems,
} from "../../interface";

//  Initialize state of selectedItems outside of component to avoid creating new object on each render
const INITIAL_SELECTED_ITEMS = [{ id: null }];

const CPOForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: CPOFormProps): JSX.Element => {
  const currentDate = new Date().toISOString().split("T")[0];
  const isEditDisabled =
    selectedRow !== undefined && selectedRow?.status !== "unposted";
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
  const [discounts, setDiscounts] = useState({
    supplier: ["", "", ""],
    transaction: ["", "", ""],
  });
  const [pesoRate, setPesoRate] = useState<number | string>(56);
  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [remarks, setRemarks] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [indexOfModal, setIndexOfModal] = useState(0);

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
      setStatus(selectedRow?.status ?? "pending");
      setTransactionDate(selectedRow?.transaction_date ?? currentDate);
      setReferenceNumber(selectedRow?.reference_number ?? "");
      setRemarks(selectedRow?.remarks ?? "");

      // Get Supplier for Edit
      axiosInstance
        .get<Supplier>(`/api/suppliers/${selectedRow?.supplier_id}`)
        .then((response) => {
          setSelectedSupplier(response.data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedRow]);

  useEffect(() => {
    // Set CPOItems only after items exist for edit
    if (selectedRow !== undefined && items.length > 0) {
      getAllCPOItems();
    }
  }, [items]);

  useEffect(() => {
    if (selectedSupplier !== null) {
      // Fetch items for the selected supplier
      axiosInstance
        .get<PaginatedItems>(
          `/api/items?supplier_id=${selectedSupplier.supplier_id}`,
        )
        .then((response) => {
          setItems(response.data.items);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedSupplier]);

  const createPayload = (
    itemPayload: CPOItemValues[],
    isEdit: boolean,
  ): CPOPayload => {
    const payload: CPOPayload = {
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
      peso_rate: Number(pesoRate),
      net_amount: netAmount,
      reference_number: referenceNumber,
      landed_total: landedTotal,
      remarks,
      items: itemPayload,
    };

    if (isEdit) {
      payload.modified_by = 1;
    } else {
      payload.created_by = 1;
    }

    return payload;
  };

  const fobTotal: number = selectedItems.reduce((acc: number, item: Item) => {
    // Explicitly check for a valid number on id, and ensure price and volume are greater than zero.
    if (
      typeof item.id === "number" && // Check that id is a number.
      item?.price !== undefined &&
      !isNaN(item.price) &&
      item.price > 0 &&
      item?.volume !== undefined &&
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
  const landedTotal = netAmount * Number(pesoRate);

  const getAllCPOItems = (): void => {
    const CPOItems = selectedRow?.items;
    if (CPOItems === undefined) return;

    // If selected supplier is different from the selected row supplier (i.e. user edited supplier)
    // make CPO blank
    if (selectedRow?.supplier.supplier_id !== selectedSupplier?.supplier_id) {
      setSelectedItems(INITIAL_SELECTED_ITEMS);
      return;
    }

    const selectedItems = CPOItems.map((item) => {
      const id = item.item_id;
      const foundItem = items.find((i) => i.id === id);

      const modifiedItem = {
        ...foundItem,
        price: item.price,
        volume: item.volume,
        on_stock: item.on_stock,
        allocated: item.allocated,
        in_transit: item.in_transit,
      };

      return modifiedItem;
    });

    // Sort items
    selectedItems.sort((a, b) => {
      const stockCodeA = a.stock_code ?? ""; // Default to empty string if undefined
      const stockCodeB = b.stock_code ?? ""; // Default to empty string if undefined
      return stockCodeA.localeCompare(stockCodeB);
    });

    // @ts-expect-error (Used null instead of undefined.)
    selectedItems?.push({ id: null });
    setSelectedItems(selectedItems);
  };

  const handleCreateCPO = async (): Promise<void> => {
    if (selectedItems.length === 1) {
      toast.error("Error: No Items Selected");
      return;
    }

    if (!areDiscountsValid(discounts)) {
      toast.error(
        "Error: Discounts must be a positive number with or without %",
      );
      return;
    }

    const itemPayload: CPOItemValues[] = selectedItems
      .filter((item: Item) => item.id !== null)
      .map((item: Item) => ({
        item_id: item.id,
        volume: item.volume,
        unserved_spo: item.volume,
        price: item.price,
        total_price: Number(item.volume) * Number(item.price),
      }));

    const payload = createPayload(itemPayload, false);
    try {
      await axiosInstance.post("/api/purchase_orders/", payload);
      toast.success("Save successful!");
      resetForm();
      setOpen(false);
      // Handle the response, update state, etc.
    } catch (error: any) {
      toast.error(
        `Error message: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
      );
    }
  };

  const handleEditCPO = async (): Promise<void> => {
    if (selectedItems.length === 1) {
      toast.error("Error: No Items Selected");
      return;
    }

    if (!areDiscountsValid(discounts)) {
      toast.error(
        "Error: Discounts must be a positive number with or without %",
      );
      return;
    }

    const itemPayload: CPOItemValues[] = selectedItems
      .filter((item: Item) => item.id !== null)
      .map((item: Item) => ({
        item_id: item.id,
        volume: Number(item.volume),
        price: Number(item.price),
        unserved_spo: Number(item.volume),
        total_price: Number(item.volume) * Number(item.price),

        // Fields needed only for edit
        on_stock: item.on_stock,
        allocated: item.allocated,
        in_transit: item.in_transit,
      }));

    const payload = createPayload(itemPayload, true);
    try {
      await axiosInstance.put(
        `/api/purchase_orders/${selectedRow?.id}`,
        payload,
      );
      setOpen(false);
      toast.success("Save successful!");
      // Handle the response, update state, etc.
    } catch (error: any) {
      toast.error(
        `Error message: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
      );
    }
  };

  const resetForm = (): void => {
    setSelectedSupplier(null);
    setItems([]);
    setSelectedItems(INITIAL_SELECTED_ITEMS);
    setCurrencyUsed("USD");
    setDiscounts({
      supplier: ["0", "0", "0"],
      transaction: ["0", "0", "0"],
    });
    setPesoRate(56);
    setStatus("unposted");
    setTransactionDate(currentDate);
    setReferenceNumber("");
    setRemarks("");
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (openCreate) await handleCreateCPO();
        if (openEdit) await handleEditCPO();
      }}
      onKeyDown={(e): void => {
        if (isConfirmOpen && e.key === "Enter") {
          e.preventDefault();
        }
      }}
    >
      <div className="flex justify-between">
        <h2 className="mb-6">{title}</h2>
      </div>
      <CPOFormDetails
        openEdit={openEdit}
        selectedRow={selectedRow}
        suppliers={suppliers}
        // Fields
        selectedSupplier={selectedSupplier}
        setSelectedSupplier={setSelectedSupplier}
        setSelectedItems={setSelectedItems}
        status={status}
        setStatus={setStatus}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        discounts={discounts}
        setDiscounts={setDiscounts}
        remarks={remarks}
        setRemarks={setRemarks}
        referenceNumber={referenceNumber}
        setReferenceNumber={setReferenceNumber}
        currencyUsed={currencyUsed}
        setCurrencyUsed={setCurrencyUsed}
        pesoRate={pesoRate}
        setPesoRate={setPesoRate}
        // Summary Amounts
        fobTotal={fobTotal}
        netAmount={netAmount}
        landedTotal={landedTotal}
      />
      <CPOFormTable
        items={items}
        status={status}
        selectedRow={selectedRow}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        indexOfModal={indexOfModal}
        setIndexOfModal={setIndexOfModal}
        isConfirmOpen={isConfirmOpen}
        setIsConfirmOpen={setIsConfirmOpen}
        selectedSupplier={selectedSupplier}
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
          {isEditDisabled ? "Go Back" : "Cancel"}
        </Button>
        {!isEditDisabled && (
          <Button
            type="submit"
            className="ml-4 w-[130px] bg-button-primary"
            size="sm"
          >
            <SaveIcon className="mr-2" />
            Save
          </Button>
        )}
      </div>
    </form>
  );
};

export default CPOForm;
