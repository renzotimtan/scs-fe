import { useEffect, useState } from "react";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";
import axiosInstance from "../../utils/axiosConfig";
import DeletePurchaseOrderModal from "./DeletePurchaseOrderModal";
import type { PurchaseOrder } from "../../pages/purchasing/purchase-order";
import { toast } from "react-toastify";

interface ViewPurchaseOrderProps {
  setOpenCreate: (isOpen: boolean) => void;
  setOpenEdit: (isOpen: boolean) => void;
  selectedRow: PurchaseOrder | undefined;
  setSelectedRow: (purchaseOrder: PurchaseOrder) => void;
}

const ViewPurchaseOrder = ({
  setOpenCreate,
  setOpenEdit,
  selectedRow,
  setSelectedRow,
}: ViewPurchaseOrderProps): JSX.Element => {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [openDelete, setOpenDelete] = useState(false);

  useEffect(() => {
    // Fetch purchase orders
    axiosInstance
      .get<PurchaseOrder[]>("/api/purchase_orders/")
      .then((response) => setPurchaseOrders(response.data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleDeletePurchaseOrder = async (): Promise<void> => {
    if (selectedRow !== undefined) {
      const url = `/api/purchase_orders/${selectedRow.id}`;
      try {
        await axiosInstance.delete(url);
        toast.success("Delete successful!");
        setPurchaseOrders(
          purchaseOrders.filter(
            (purchaseOrder) => purchaseOrder.id !== selectedRow.id,
          ),
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
          <h2>Purchase Order</h2>
          <Button
            className="mt-2 mb-4 bg-button-primary"
            color="primary"
            onClick={() => {
              setOpenCreate(true);
            }}
          >
            Add Purchase Order
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
                <th style={{ width: "var(--Table-firstColumnWidth)" }}>
                  PO Number
                </th>
                <th style={{ width: 300 }}>Status</th>
                <th style={{ width: 300 }}>Supplier</th>
                <th style={{ width: 250 }}>Transaction Date</th>
                <th style={{ width: 150 }}>Supplier Discount</th>
                <th style={{ width: 150 }}>Currency Used</th>
                <th style={{ width: 150 }}>Peso Rate</th>
                <th style={{ width: 150 }}>Net Amount</th>
                <th style={{ width: 150 }}>FOB Total</th>
                <th style={{ width: 150 }}>Landed Total</th>
                <th style={{ width: 200 }}>Reference Number</th>
                <th style={{ width: 300 }}>Remarks</th>
                <th style={{ width: 200 }}>Created By</th>
                <th style={{ width: 200 }}>Modified By</th>
                <th style={{ width: 250 }}>Date Created</th>
                <th style={{ width: 250 }}>Date Modified</th>
                <th
                  aria-label="last"
                  style={{ width: "var(--Table-lastColumnWidth)" }}
                />
              </tr>
            </thead>
            <tbody>
              {purchaseOrders.map((purchaseOrder) => (
                <tr key={purchaseOrder.id}>
                  <td>{purchaseOrder.purchase_order_number}</td>
                  <td className="capitalize">{purchaseOrder.status}</td>
                  <td>{purchaseOrder.supplier_id}</td>
                  <td>{purchaseOrder.transaction_date}</td>
                  <td>{purchaseOrder.supplier_discount}</td>
                  <td>{purchaseOrder.currency_used}</td>
                  <td>{purchaseOrder.peso_rate}</td>
                  <td>{purchaseOrder.net_amount}</td>
                  <td>{purchaseOrder.fob_total}</td>
                  <td>{purchaseOrder.landed_total}</td>
                  <td>{purchaseOrder.reference_number}</td>
                  <td>{purchaseOrder.remarks}</td>
                  <td>{purchaseOrder.created_by}</td>
                  <td>{purchaseOrder.modified_by}</td>
                  <td>{purchaseOrder.date_created}</td>
                  <td>{purchaseOrder.date_modified}</td>
                  <td>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="sm"
                        variant="plain"
                        color="neutral"
                        onClick={() => {
                          setOpenEdit(true);
                          setSelectedRow(purchaseOrder);
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
                          setSelectedRow(purchaseOrder);
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
      <DeletePurchaseOrderModal
        open={openDelete}
        setOpen={setOpenDelete}
        title="Delete Warehouse"
        onDelete={handleDeletePurchaseOrder}
      />
    </>
  );
};

export default ViewPurchaseOrder;
