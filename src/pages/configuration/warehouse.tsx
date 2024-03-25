import { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import WarehousesModal from "../../components/Warehouses/WarehousesModal";
import DeleteWarehousesModal from "../../components/Warehouses/DeleteWarehouseModal";
import axiosInstance from "../../utils/axiosConfig";
import type { User } from "../Login";
import { toast } from "react-toastify";
export interface Warehouse {
  id: number;
  code: string;
  name: string;
  type: string;
  created_by: number;
  modified_by: number;
  date_created: string;
  date_modified: string;
}

const WarehouseForm = (): JSX.Element => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Warehouse>();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch warehouses
    axiosInstance
      .get<Warehouse[]>("/api/warehouses/")
      .then((response) => setWarehouses(response.data))
      .catch((error) => console.error("Error:", error));

    // Fetch user ID
    axiosInstance
      .get<User>("/users/me/")
      .then((response) => setUserId(response.data.id))
      .catch((error) => console.error("Error fetching user ID:", error));
  }, []);

  const handleSaveWarehouse = async (
    newWarehouse: Warehouse,
  ): Promise<void> => {
    const url = `/api/warehouses/${newWarehouse.id}`;

    const payload = {
      name: newWarehouse.name,
      type: newWarehouse.type,
      modified_by: userId,
      id: newWarehouse.id,
      code: newWarehouse.code,
    };
    try {
      const response = await axiosInstance.put(url, payload);

      setWarehouses(
        warehouses.map((warehouse) =>
          warehouse.id === response.data.id ? response.data : warehouse,
        ),
      );

      setOpenAdd(false);
      setOpenEdit(false);
      toast.success("Save successful!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateWarehouse = async (
    newWarehouse: Warehouse,
  ): Promise<void> => {
    const payload = {
      id: newWarehouse.id,
      name: newWarehouse.name,
      type: newWarehouse.type,
      created_by: userId,
      code: newWarehouse.code,
    };
    try {
      const response = await axiosInstance.post("/api/warehouses/", payload);

      setWarehouses([...warehouses, response.data]);
      setOpenAdd(false);
      toast.success("Save successful!");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteWarehouse = async (): Promise<void> => {
    if (selectedRow !== undefined) {
      const url = `/api/warehouses/${selectedRow.id}`;
      try {
        await axiosInstance.delete(url);
        toast.success("Delete successful!");
        setWarehouses(
          warehouses.filter((warehouse) => warehouse.id !== selectedRow.id),
        );
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box className="flex justify-between mb-6">
          <h2>Warehouses</h2>
          <Button
            className="mt-2 mb-4 bg-button-primary"
            color="primary"
            onClick={() => {
              setOpenAdd(true);
            }}
          >
            Add Warehouse
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
                <th style={{ width: 100 }}>Type</th>
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
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>{warehouse.code}</td>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.type}</td>
                  <td>{warehouse.created_by}</td>
                  <td>{warehouse.date_created}</td>
                  <td>{warehouse.modified_by}</td>
                  <td>{warehouse.date_modified}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedRow(warehouse);
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
                          setSelectedRow(warehouse);
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
      <WarehousesModal
        open={openAdd}
        setOpen={setOpenAdd}
        title="Add Warehouses"
        onSave={handleCreateWarehouse}
      />
      <WarehousesModal
        open={openEdit}
        setOpen={setOpenEdit}
        title="Edit Warehouse"
        row={selectedRow}
        onSave={handleSaveWarehouse}
      />
      <DeleteWarehousesModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Warehouse"
        onDelete={handleDeleteWarehouse}
      />
    </>
  );
};

export default WarehouseForm;
