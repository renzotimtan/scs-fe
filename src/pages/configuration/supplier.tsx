import { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import SuppliersModal from "../../components/Suppliers/SuppliersModal";
import DeleteSuppliersModal from "../../components/Suppliers/DeleteSupplierModal";
import axiosInstance from "../../utils/axiosConfig";
import type { User } from "../Login";
import { toast } from "react-toastify";

export interface Supplier {
  supplier_id: number;
  code: string;
  name: string;
  building_address: string;
  street_address: string;
  city: string;
  province: string;
  country: string;
  zip_code: string;
  contact_person: string;
  contact_number: string;
  email: string;
  fax_number: string;
  currency: string;
  discount_rate: number;
  supplier_balance: number;
  created_by: number;
  creator: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  modifier: {
    full_name: string;
    username: string;
    email: string;
    id: number;
  };
  modified_by: number;
  date_created: string;
  date_modified: string;
  notes: string;
}

interface PaginatedSuppliers {
  total: number;
  items: Supplier[];
}

interface SupplierQueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_order?: string;
  search_term?: string;
}

const SupplierForm = (): JSX.Element => {
  const [suppliers, setSuppliers] = useState<PaginatedSuppliers>({
    total: 0,
    items: [],
  });
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Supplier>();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Query parameters
    const queryParams: SupplierQueryParams = {
      page: 1,
      limit: 10,
      sort_by: "supplier_id",
      sort_order: "asc",
      search_term: "",
    };

    // Convert the query parameters to a query string
    const queryString = Object.entries(queryParams)
      .filter(([_, value]) => value !== undefined)
      .map(([key, value]) => {
        if (
          typeof value === "string" ||
          typeof value === "number" ||
          typeof value === "boolean"
        ) {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`;
        } else {
          console.error(
            `Invalid query parameter value for key "${key}":`,
            value,
          );
          return "";
        }
      })
      .filter((param) => param !== "")
      .join("&");

    // Fetch suppliers
    axiosInstance
      .get<PaginatedSuppliers>(`/api/suppliers/?${queryString}`)
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error:", error));

    // Fetch user ID
    axiosInstance
      .get<User>("/users/me/")
      .then((response) => setUserId(response.data.id))
      .catch((error) => console.error("Error fetching user ID:", error));
  }, []);

  const handleSaveSupplier = async (newSupplier: Supplier): Promise<void> => {
    const url = `/api/suppliers/${newSupplier.supplier_id}`;

    const payload = {
      supplier_id: newSupplier.supplier_id,
      code: newSupplier.code,
      name: newSupplier.name,
      building_address: newSupplier.building_address,
      street_address: newSupplier.street_address,
      city: newSupplier.city,
      province: newSupplier.province,
      country: newSupplier.country,
      zip_code: newSupplier.zip_code,
      contact_person: newSupplier.contact_person,
      contact_number: newSupplier.contact_number,
      email: newSupplier.email,
      fax_number: newSupplier.fax_number,
      currency: newSupplier.currency,
      discount_rate: newSupplier.discount_rate,
      supplier_balance: newSupplier.supplier_balance,
      modified_by: userId,
      notes: newSupplier.notes,
    };
    try {
      const response = await axiosInstance.put(url, payload);

      setSuppliers((prevSuppliers) => ({
        ...prevSuppliers,
        items: prevSuppliers.items.map((supplier) =>
          supplier.supplier_id === response.data.supplier_id
            ? response.data
            : supplier,
        ),
      }));

      setOpenAdd(false);
      setOpenEdit(false);
      toast.success("Save successful!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateSupplier = async (newSupplier: Supplier): Promise<void> => {
    const payload = {
      code: newSupplier.code,
      name: newSupplier.name,
      building_address: newSupplier.building_address,
      street_address: newSupplier.street_address,
      city: newSupplier.city,
      province: newSupplier.province,
      country: newSupplier.country,
      zip_code: newSupplier.zip_code,
      contact_person: newSupplier.contact_person,
      contact_number: newSupplier.contact_number,
      email: newSupplier.email,
      fax_number: newSupplier.fax_number,
      currency: newSupplier.currency,
      discount_rate: newSupplier.discount_rate,
      supplier_balance: newSupplier.supplier_balance,
      created_by: userId,
      notes: newSupplier.notes,
    };
    try {
      const response = await axiosInstance.post("/api/suppliers/", payload);

      setSuppliers((prevSuppliers) => ({
        ...prevSuppliers,
        items: [...prevSuppliers.items, response.data],
        total: prevSuppliers.total + 1,
      }));
      setOpenAdd(false);
      toast.success("Save successful!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteSupplier = async (): Promise<void> => {
    if (selectedRow !== undefined) {
      const url = `/api/suppliers/${selectedRow.supplier_id}`;
      try {
        await axiosInstance.delete(url);
        toast.success("Delete successful!");
        setSuppliers((prevSuppliers) => ({
          ...prevSuppliers,
          items: prevSuppliers.items.filter(
            (supplier) => supplier.supplier_id !== selectedRow.supplier_id,
          ),
          total: prevSuppliers.total - 1,
        }));
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box className="flex justify-between mb-6">
          <h2>Suppliers</h2>
          <Button
            className="mt-2 mb-4 bg-button-primary"
            color="primary"
            onClick={() => {
              setOpenAdd(true);
            }}
          >
            Add Suppliers
          </Button>
        </Box>
        <Sheet
          sx={{
            "--TableCell-height": "40px",
            // the number is the amount of the header rows.
            "--TableHeader-height": "calc(1 * var(--TableCell-height))",
            "--Table-firstColumnWidth": "150px",
            "--Table-lastColumnWidth": "144px",
            // background needs to have transparency to show the scrolling shadows
            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
            "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
            overflow: "auto",
            borderRadius: 8,
            background: (
              theme,
            ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
            linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
            radial-gradient(
              farthest-side at 0 50%,
              rgba(0, 0, 0, 0.12),
              rgba(0, 0, 0, 0)
            ),
            radial-gradient(
                farthest-side at 100% 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              )
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
                <th style={{ width: "var(--Table-firstColumnWidth)" }}>Code</th>
                <th style={{ width: 300 }}>Name</th>
                <th style={{ width: 300 }}>Building Address</th>
                <th style={{ width: 300 }}>Street Address</th>
                <th style={{ width: 150 }}>City</th>
                <th style={{ width: 150 }}>Province</th>
                <th style={{ width: 150 }}>Country</th>
                <th style={{ width: 100 }}>Zip Code</th>
                <th style={{ width: 150 }}>Contact Person</th>
                <th style={{ width: 150 }}>Contact Number</th>
                <th style={{ width: 300 }}>Contact Email</th>
                <th style={{ width: 150 }}>Fax Number</th>
                <th style={{ width: 100 }}>Currency</th>
                <th style={{ width: 100 }}>Discount Rate</th>
                <th style={{ width: 100 }}>Supplier Balance</th>
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
              {suppliers.items.map((supplier) => (
                <tr key={supplier.supplier_id}>
                  <td>{supplier.code}</td>
                  <td>{supplier.name}</td>
                  <td>{supplier.building_address}</td>
                  <td>{supplier.street_address}</td>
                  <td>{supplier.city}</td>
                  <td>{supplier.province}</td>
                  <td>{supplier.country}</td>
                  <td>{supplier.zip_code}</td>
                  <td>{supplier.contact_person}</td>
                  <td>{supplier.contact_number}</td>
                  <td>{supplier.email}</td>
                  <td>{supplier.fax_number}</td>
                  <td>{supplier.currency}</td>
                  <td>{supplier.discount_rate}</td>
                  <td>{supplier.supplier_balance}</td>
                  <td>{supplier.creator.full_name}</td>
                  <td>{supplier.date_created}</td>
                  <td>{supplier?.modifier?.full_name}</td>
                  <td>{supplier.date_modified}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedRow(supplier);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="soft"
                        color="danger"
                        className="bg-delete-red"
                        onClick={() => {
                          setOpenDelete(true);
                          setSelectedRow(supplier);
                        }}
                      >
                        Delete
                      </Button>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Sheet>
      </Box>
      <SuppliersModal
        open={openAdd}
        setOpen={setOpenAdd}
        title="Add Suppliers"
        onSave={handleCreateSupplier}
      />
      <SuppliersModal
        open={openEdit}
        setOpen={setOpenEdit}
        title="Edit Supplier"
        row={selectedRow}
        onSave={handleSaveSupplier}
      />
      <DeleteSuppliersModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Supplier"
        onDelete={handleDeleteSupplier}
      />
    </>
  );
};

export default SupplierForm;
