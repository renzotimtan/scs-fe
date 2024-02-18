import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Table from "@mui/joy/Table";
import Sheet from "@mui/joy/Sheet";

function createData(
  code: string,
  name: string,
  type: string,
  createdBy: string,
  dateCreated: string,
  modifiedBy: string,
  dateModified: string,
) {
  return { code, name, type, createdBy, dateCreated, modifiedBy, dateModified };
}

const rows = [
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
  createData(
    "RT1",
    "ARANETA WAREHOUSE",
    "Stock",
    "TATA",
    "02/18/2024 12:00AM",
    "RENZO",
    "02/18/2024 12:00AM",
  ),
];

const WarehouseForm = (): JSX.Element => {
  return (
    <Box sx={{ width: "100%" }}>
      <h2 className="mb-6">Warehouses</h2>
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
              <th style={{ width: "var(--Table-firstColumnWidth)" }}>Code</th>
              <th style={{ width: 300 }}>Name</th>
              <th style={{ width: 100 }}>Type</th>
              <th style={{ width: 100 }}>Created By</th>
              <th style={{ width: 200 }}>Date Created</th>
              <th style={{ width: 100 }}>Modified By</th>
              <th style={{ width: 200 }}>Date Modified</th>
              <th
                aria-label="last"
                style={{ width: "var(--Table-lastColumnWidth)" }}
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code}>
                <td>{row.code}</td>
                <td>{row.name}</td>
                <td>{row.type}</td>
                <td>{row.createdBy}</td>
                <td>{row.dateCreated}</td>
                <td>{row.modifiedBy}</td>
                <td>{row.dateModified}</td>
                <td>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button size="sm" variant="plain" color="neutral">
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="soft"
                      color="danger"
                      className="bg-delete-red"
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
  );
};

export default WarehouseForm;
