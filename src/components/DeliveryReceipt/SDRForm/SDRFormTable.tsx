import { Sheet } from "@mui/joy";
import Table from "@mui/joy/Table";

import type { POFormTableProps } from "../interface";

const POFormTable = ({ selectedPOs }: POFormTableProps): JSX.Element => {
  return (
    <Sheet
      sx={{
        "--TableCell-height": "40px",
        // the number is the amount of the header rows.
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "150px",
        "--Table-lastColumnWidth": "86px",
        // background needs to have transparency to show the scrolling shadows
        "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
        "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
        overflow: "auto",
        borderRadius: 8,
        marginTop: 3,
        background: (
          theme,
        ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
              linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
              radial-gradient(
                farthest-side at 0 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              ),
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
          // "& tr > *:last-child": {
          //   position: "sticky",
          //   right: 0,
          //   bgcolor: "var(--TableCell-headBackground)",
          // },
        }}
        borderAxis="both"
      >
        <thead>
          <tr>
            <th
              style={{
                width: "var(--Table-firstColumnWidth)",
              }}
            >
              PO No.
            </th>
            <th style={{ width: 300 }}>Stock Code</th>
            <th style={{ width: 300 }}>Name</th>
            <th style={{ width: 150 }}>PO Qty.</th>
            <th style={{ width: 150 }}>Unserved Qty.</th>
            <th style={{ width: 150 }}>Price</th>
            <th style={{ width: 150 }}>Srv. Qty.</th>
            <th style={{ width: 150 }}>Supp. Disc. 1</th>
            <th style={{ width: 150 }}>Supp. Disc. 2</th>
            <th style={{ width: 150 }}>Supp. Disc. 3</th>
            <th style={{ width: 150 }}>Tran. Disc. 1</th>
            <th style={{ width: 150 }}>Tran. Disc. 2</th>
            <th style={{ width: 150 }}>Tran. Disc. 3</th>
            <th style={{ width: 150 }}>Gross</th>
            <th style={{ width: 150 }}>Currency</th>
            <th style={{ width: 150 }}>Peso Rate</th>
            {/* <th
              aria-label="last"
              style={{ width: "var(--Table-lastColumnWidth)" }}
            /> */}
          </tr>
        </thead>
        <tbody>
          {selectedPOs.map((PO, index1) => {
            return PO.items.map((POItem, index2) => {
              return (
                <tr key={`${POItem.id}-${index1}-${index2}`}>
                  <td>{PO.id}</td>
                  <td>{POItem?.item.stock_code}</td>
                  <td>{POItem?.item.name}</td>
                  <td>{POItem.volume}</td>
                  <td>{POItem?.unserved_spo}</td>
                  <td>{POItem?.price}</td>
                  <td>served quantity</td>
                  <td>{PO.supplier_discount_1}</td>
                  <td>{PO.supplier_discount_2}</td>
                  <td>{PO.supplier_discount_3}</td>
                  <td>{PO.transaction_discount_1}</td>
                  <td>{PO.transaction_discount_2}</td>
                  <td>{PO.transaction_discount_3}</td>
                  <td>Gross</td>
                  <td>{PO.currency_used}</td>
                  <td>{PO.peso_rate}</td>
                </tr>
              );
            });
          })}
          {/* {selectedPOItems.map((selectedPOItem: POItems, index: number) => (
            <tr key={`${selectedPOItem.id}-${index}`}>
              <td>{selectedPOItem.purchase_order_id}</td>
              <td>{selectedPOItem?.item.stock_code}</td>
              <td>{selectedPOItem?.item.name}</td>
              <td>PO Qty.</td>
              <td>{selectedPOItem?.unserved_spo}</td>
              <td>{selectedPOItem?.price}</td>
              <td>Served Quantity</td>
              <td>Supp Disc</td>
              <td>Tran Disc</td>
              <td>Gross</td>
              <td>Currency</td>
              <td>Peso Rate</td>
            </tr>
          ))} */}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default POFormTable;
