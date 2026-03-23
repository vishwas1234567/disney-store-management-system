import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { OrderItem } from "@/types/order";

export const generateInvoicePDF = (
  orderId: string, 
  items: OrderItem[], 
  totalAmount: number, 
  date: Date = new Date()
) => {
  // Initialize the jsPDF document
  const doc = new jsPDF();

  // 1. Header (Store Name)
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(37, 99, 235); // Tailwind blue-600
  doc.text("Disney Store", 14, 25);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text("Official Point of Sale Invoice", 14, 32);
  
  // 2. Order Metadata
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(12);
  doc.text(`Order ID: ${orderId}`, 14, 48);
  doc.text(`Transaction Date: ${date.toLocaleString()}`, 14, 55);

  // 3. Mapping Cart Array to Rows
  const tableData = items.map((item) => [
    item.name,
    item.quantity.toString(),
    `$${Number(item.price).toFixed(2)}`,
    `$${(item.price * item.quantity).toFixed(2)}`
  ]);

  // 4. Inject Dynamic Table
  autoTable(doc, {
    startY: 65,
    head: [["Item Description", "QTY", "Unit Price", "Subtotal"]],
    body: tableData,
    theme: "striped",
    headStyles: { 
      fillColor: [37, 99, 235], // blue-600 
      textColor: 255,
      halign: 'left'
    },
    columnStyles: {
      1: { halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' }
    },
    styles: {
      fontSize: 10,
      font: "helvetica",
      cellPadding: 4,
    }
  });

  // 5. Total Calculations & Footer
  // TypeScript hack utilizing jsPDF autoTable integration
  const finalY = (doc as any).lastAutoTable.finalY || 65;

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(20, 20, 20);
  doc.text(
    `Grand Total: $${Number(totalAmount).toFixed(2)}`, 
    14, 
    finalY + 15
  );

  // Footer message
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("Thank you for shopping at the Disney Store!", 14, finalY + 30);

  // 6. Force Local Browser Download
  doc.save(`DisneyStore_Invoice_${orderId}.pdf`);
};
