import { Button, Divider } from "@mui/joy";
import SaveIcon from "@mui/icons-material/Save";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { useEffect, useMemo, useState } from "react";
import axiosInstance from "../../utils/axiosConfig";
import { toast } from "react-toastify";
import type { User } from "../../pages/Login";
import {
  type PaginatedWarehouse,
  type WarehouseItem,
  type Item,
  type Customer,
  type PaginatedCustomers,
  type AllocFormProps,
  PaginatedCPO,
} from "../../interface";
import { convertToQueryParams } from "../../helper";
import { AllocFormPayload, CPOItemFE } from "./interface";
import AllocFormDetails from "./AllocForm/AllocFormDetails";
import AllocFormTable from "./AllocForm/AllocFormTable";

const AllocForm = ({
  setOpen,
  openCreate,
  openEdit,
  selectedRow,
  title,
}: AllocFormProps): JSX.Element => {
  const currentDate = new Date().toISOString().split("T")[0];
  const [status, setStatus] = useState("unposted");
  const [transactionDate, setTransactionDate] = useState(currentDate);
  const [remarks, setRemarks] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [warehouses, setWarehouses] = useState<PaginatedWarehouse>({
    total: 0,
    items: [],
  });

  const [customers, setCustomers] = useState<PaginatedCustomers>({
    total: 0,
    items: [],
  });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const [CPOItems, setCPOItems] = useState<CPOItemFE[]>([]);

  useEffect(() => {
    // Fetch warehouses
    axiosInstance
      .get<PaginatedWarehouse>("/api/warehouses/")
      .then((response) => {
        setWarehouses(response.data);
      })
      .catch((error) => console.error("Error:", error));

    // Fetch customers
    axiosInstance
      .get<PaginatedCustomers>("/api/customers/")
      .then((response) => setCustomers(response.data))
      .catch((error) => console.error("Error:", error));

    // Fetch user ID
    axiosInstance
      .get<User>("/users/me/")
      .then((response) => setUserId(response.data.id))
      .catch((error) => console.error("Error fetching user ID:", error));
  }, []);

  useEffect(() => {
    // Fill in fields for Edit
    if (selectedRow) {
      setStatus(selectedRow?.status ?? "unposted");
      setTransactionDate(selectedRow?.transaction_date ?? currentDate);
      setRemarks(selectedRow?.remarks ?? "");
    }
  }, [selectedRow]);

  const getCPOsByCustomer = (customer_id: number | undefined) => {
    if (customer_id) {
      const params = {
        customer_id,
        has_unserved: true,
      };

      axiosInstance
        .get<PaginatedCPO>(
          `/api/customer_purchase_orders/?${convertToQueryParams(params)}`,
        )
        .then((response) => {
          const CPOItems = response.data.items
            .map((CPO) => {
              return CPO.items.map((CPOItem) => {
                return {
                  id: CPO.id,
                  name: CPOItem.item.name,
                  volume: CPOItem.volume,
                  alloc_qty: CPOItem.volume - CPOItem.unserved_cpo,
                  item_id: CPOItem.item_id,

                  // allocations
                  warehouse_1: null,
                  warehouse_1_qty: undefined,
                  warehouse_2: null,
                  warehouse_2_qty: undefined,
                  warehouse_3: null,
                  warehouse_3_qty: undefined,
                };
              });
            })
            .flat();

          setCPOItems(CPOItems);
        })
        .catch((error) => console.error("Error", error));
    }
  };

  const handleCreateAlloc = async () => {
    const payload = {
      status,
      transaction_date: transactionDate,
      remarks,
      customer_id: selectedCustomer?.customer_id ?? null,
    };

    try {
      await axiosInstance.post("/api/stock-transfers/", payload);
      toast.success("Save successful!");
      resetForm();
      setOpen(false);
      // Handle the response, update state, etc.
    } catch (error: any) {
      console.log(error);
      toast.error(
        `Error: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
      );
    }
  };

  const handleEditAlloc = async () => {
    const payload = {
      status,
      transaction_date: transactionDate,
      remarks,
    };

    try {
      await axiosInstance.put(
        `api/stock-transfers/${selectedRow?.id}`,
        payload,
      );
      toast.success("Save successful!");
      resetForm();
      setOpen(false);
      // Handle the response, update state, etc.
    } catch (error: any) {
      console.log(error);
      toast.error(
        `Error: ${error?.response?.data?.detail[0]?.msg || error?.response?.data?.detail}`,
      );
    }
  };

  const resetForm = (): void => {
    setStatus("unposted");
    setTransactionDate(currentDate);
    setRemarks("");
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        if (openCreate) await handleCreateAlloc();
        if (openEdit) await handleEditAlloc();
      }}
    >
      <div className="flex justify-between">
        <h2 className="mb-6">{title}</h2>
      </div>
      <AllocFormDetails
        openEdit={openEdit}
        selectedRow={selectedRow}
        status={status}
        setStatus={setStatus}
        transactionDate={transactionDate}
        setTransactionDate={setTransactionDate}
        remarks={remarks}
        setRemarks={setRemarks}
        warehouses={warehouses}
        customers={customers}
        selectedCustomer={selectedCustomer}
        setSelectedCustomer={setSelectedCustomer}
        getCPOsByCustomer={getCPOsByCustomer}
        setCPOItems={setCPOItems}
      />
      <AllocFormTable
        selectedRow={selectedRow}
        warehouses={warehouses}
        selectedCustomer={selectedCustomer}
        CPOItems={CPOItems}
        setCPOItems={setCPOItems}
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

export default AllocForm;
