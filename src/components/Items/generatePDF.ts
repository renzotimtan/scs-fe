import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const addCustomHeader = (doc, title: string): void => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Company Name (bold)
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text(title, 40, 40);

  // Address and contact info (normal)
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("174 G. ARANETA AVE., QUEZON CITY,", 40, 50);
  doc.text("TEL#: 725-4481, 725-4489, 726-1315", 40, 60);
  doc.text("FAX#: 724-8680", 40, 70);
  doc.text("E-MAIL: peterson_174@yahoo.com", 40, 80);

  // "PRICELIST" aligned to the right
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("PRICELIST", pageWidth - 80, 40); // Adjust 80 as needed

  // Bottom border line
  doc.setLineWidth(0.5);
  doc.line(40, 90, pageWidth - 40, 90); // Draw horizontal line
};

export const generatePDF = (data, title: string): void => {
  // 1. Initialize jsPDF
  const doc = new jsPDF({
    orientation: "portrait", // or "landscape"
    unit: "pt",
    format: "A4",
  });

  addCustomHeader(doc, title);

  // 2. Define the columns (headers) and rows from your data
  // We can map our sampleData to an array of arrays
  const tableColumnHeaders = [
    "Stock Qty",
    "Stock Code",
    "Stock",
    "Net Cost Total",
  ];
  const tableRows = data.map((item) => [
    item.availableQty,
    item.stockCode,
    item.stock,
    item.netCostTotal,
  ]);

  // 3. Add a title (optional)
  // doc.setFontSize(16);
  // doc.text(title, 40, 40); // x=40, y=40

  // 4. Use autoTable to generate a table
  const pageWidth = doc.internal.pageSize.getWidth(); // A4 = 595.28pt approx.
  const tableWidth = 460; // sum of your columnWidths
  const marginX = (pageWidth - tableWidth) / 2; // center horizontally

  autoTable(doc, {
    startY: 100,
    head: [tableColumnHeaders],
    body: tableRows,
    margin: { top: 50, left: marginX }, // center it
    theme: "plain",
    columnStyles: {
      0: { cellWidth: 70, halign: "right" },
      1: { cellWidth: 100 },
      2: { cellWidth: 200 },
      3: { cellWidth: 90, halign: "right" },
    },
    styles: {
      fontSize: 9, // 🔽 Decrease font size here
      cellPadding: { top: 2, right: 8, bottom: 2, left: 8 },
    },
    didParseCell: function (data) {
      if (
        data.section === "head" &&
        (data.column.index === 0 || data.column.index === 3)
      ) {
        data.cell.styles.halign = "right";
      }
    },
  });

  // 5. Save or download the PDF
  doc.save("pricelist.pdf");
};
