import { useEffect, useState } from "react";
import ItemsModal from "../../components/Items/ItemsModal";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import DeleteItemsModal from "../../components/Items/DeleteItemsModal";
import axiosInstance from "../../utils/axiosConfig";
import type { User } from "../Login";
export interface Item {
  id: number;
  stock_code: string;
  name: string;
  category: string;
  brand: string;
  acquisition_cost: number;
  net_cost_before_tax: number;
  currency: string;
  pesoRate: number;
  on_stock: number;
  available: number;
  allocated: number;
  purchased: number;
  created_by: number;
  modified_by: number;
  date_created: string;
  date_modified: string;
}

const ItemForm = (): JSX.Element => {
  const [items, setItems] = useState<Item[]>([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Item>();
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch items
    axiosInstance
      .get<Item[]>("/api/items/")
      .then((response) => setItems(response.data))
      .catch((error) => console.error("Error:", error));

    // Fetch user ID
    axiosInstance
      .get<User>("/users/me/")
      .then((response) => setUserId(response.data.id))
      .catch((error) => console.error("Error fetching user ID:", error));
  }, []);

  const handleSaveItem = async (newItem: Item): Promise<void> => {
    const url = `/api/items/${newItem.id}`;

    const payload = {
      id: newItem.id,
      stock_code: newItem.stock_code,
      name: newItem.name,
      category: newItem.category,
      brand: newItem.brand,
      acquisition_cost: newItem.acquisition_cost,
      net_cost_before_tax: newItem.net_cost_before_tax,
      currency: newItem.currency,
      rate: newItem.pesoRate,
      on_stock: newItem.on_stock,
      available: newItem.available,
      allocated: newItem.allocated,
      purchased: newItem.purchased,
      created_by: userId,
    };
    try {
      const response = await axiosInstance.put(url, payload);

      setItems(
        items.map((item) =>
          item.id === response.data.id ? response.data : item,
        ),
      );

      setOpenAdd(false);
      setOpenEdit(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCreateItem = async (newItem: Item): Promise<void> => {
    const payload = {
      id: newItem.id,
      stock_code: newItem.stock_code,
      name: newItem.name,
      category: newItem.category,
      brand: newItem.brand,
      acquisition_cost: newItem.acquisition_cost,
      net_cost_before_tax: newItem.net_cost_before_tax,
      currency: newItem.currency,
      rate: newItem.pesoRate,
      on_stock: newItem.on_stock,
      available: newItem.available,
      allocated: newItem.allocated,
      purchased: newItem.purchased,
      created_by: userId,
    };
    try {
      const response = await axiosInstance.post("/api/items/", payload);

      setItems([...items, response.data]);
      setOpenAdd(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteItem = async (): Promise<void> => {
    if (selectedRow !== undefined) {
      const url = `/api/items/${selectedRow.id}`;
      try {
        await axiosInstance.delete(url);
        setItems(items.filter((item) => item.id !== selectedRow.id));
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Box className="flex justify-between mb-6">
          <h2>Items</h2>
          <Button
            className="mt-2 mb-4 bg-button-primary"
            color="primary"
            onClick={() => {
              setOpenAdd(true);
            }}
          >
            Add Item
          </Button>
        </Box>

        <Sheet
          sx={{
            "--TableCell-height": "40px",
            // the number is the amount of the header rows.
            "--TableHeader-height": "calc(1 * var(--TableCell-height))",
            "--Table-firstColumnWidth": "80px",
            "--Table-lastColumnWidth": "144px",
            // background needs to have transparency to show the scrolling shadows
            "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
            "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
            overflow: "auto",
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
          >
            <thead>
              <tr>
                <th style={{ width: "var(--Table-firstColumnWidth)" }}>
                  Stock Code
                </th>
                <th style={{ width: 300 }}>Name</th>
                <th style={{ width: 100 }}>Category</th>
                <th style={{ width: 100 }}>Brand</th>
                <th style={{ width: 150 }}>Acquision Cost (₱)</th>
                <th style={{ width: 170 }}>Net Cost B/F Tax (₱)</th>
                <th style={{ width: 100 }}>Currency</th>
                <th style={{ width: 130 }}>Peso Rate (₱)</th>
                <th style={{ width: 100 }}>On Stock</th>
                <th style={{ width: 100 }}>Available</th>
                <th style={{ width: 100 }}>Allocated</th>
                <th style={{ width: 100 }}>Purchased</th>
                <th style={{ width: 100 }}>Created By</th>
                <th style={{ width: 250 }}>Date Created</th>
                <th style={{ width: 100 }}>Modified By</th>
                <th style={{ width: 250 }}>Date Modified</th>
                <th
                  aria-label="last"
                  style={{ width: "var(--Table-lastColumnWidth)" }}
                />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.stock_code}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.brand}</td>
                  <td>{item.acquisition_cost}</td>
                  <td>{item.net_cost_before_tax}</td>
                  <td>{item.currency}</td>
                  <td>{item.pesoRate}</td>
                  <td>{item.on_stock}</td>
                  <td>{item.available}</td>
                  <td>{item.allocated}</td>
                  <td>{item.purchased}</td>
                  <td>{item.created_by}</td>
                  <td>{item.date_created}</td>
                  <td>{item.modified_by}</td>
                  <td>{item.date_modified}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedRow(item);
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
                          setSelectedRow(item);
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
      <ItemsModal
        open={openAdd}
        setOpen={setOpenAdd}
        title="Add Items"
        onSave={handleCreateItem}
      />
      <ItemsModal
        open={openEdit}
        setOpen={setOpenEdit}
        title="Edit Item"
        row={selectedRow}
        onSave={handleSaveItem}
      />
      <DeleteItemsModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Item"
        onDelete={handleDeleteItem}
      />
    </>
  );
};

export default ItemForm;
