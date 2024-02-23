import { useState } from "react";
import ItemsModal from "../../components/Items/items-modal";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import DeleteItemsModal from "../../components/Items/delete-items-modal";

export interface Item {
  stockCode: string;
  name: string;
  category: string;
  brand: string;
  acquisitionCost: number;
  netCostTax: number;
  currencyUsed: string;
  pesoRate: number;
  onStock: number;
  available: number;
  allocated: number;
  purchased: number;
}

const ItemForm = (): JSX.Element => {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Item>();

  function createData(
    stockCode: string,
    name: string,
    category: string,
    brand: string,
    acquisitionCost: number,
    netCostTax: number,
    currencyUsed: string,
    pesoRate: number,
    onStock: number,
    available: number,
    allocated: number,
    purchased: number,
  ) {
    return {
      stockCode,
      name,
      category,
      brand,
      acquisitionCost,
      netCostTax,
      currencyUsed,
      pesoRate,
      onStock,
      available,
      allocated,
      purchased,
    };
  }

  const rows = [
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
    createData(
      "ABC123",
      "Item Name",
      "Fans",
      "Fayes",
      123,
      123,
      "USD",
      45,
      50,
      50,
      0,
      0,
    ),
  ];

  return (
    <>
      <Box sx={{ width: "100%" }}>
        <h2 className="mb-6">Items</h2>

        <Box className="flex justify-end">
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
                <th
                  aria-label="last"
                  style={{ width: "var(--Table-lastColumnWidth)" }}
                />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.stockCode}>
                  <td>{row.stockCode}</td>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.brand}</td>
                  <td>{row.acquisitionCost}</td>
                  <td>{row.netCostTax}</td>
                  <td>{row.currencyUsed}</td>
                  <td>{row.pesoRate}</td>
                  <td>{row.onStock}</td>
                  <td>{row.available}</td>
                  <td>{row.allocated}</td>
                  <td>{row.purchased}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedRow(row);
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
                          setSelectedRow(row);
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
      <ItemsModal open={openAdd} setOpen={setOpenAdd} title="Add Items" />
      <ItemsModal
        open={openEdit}
        setOpen={setOpenEdit}
        title="Edit Item"
        row={selectedRow}
      />
      <DeleteItemsModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Item"
      />
    </>
  );
};

export default ItemForm;
