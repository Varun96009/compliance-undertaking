async function fillPDF() {
  const dateInput = document.getElementById("date").value.trim();
  const monthInput = document.getElementById("month").value.trim();

  // Validation
  if (!dateInput || !monthInput) {
    alert("Please fill Date and Month");
    return;
  }

  // Load PDF
  const existingPdfBytes = await fetch("Compliance_Undertaking.pdf").then(res =>
    res.arrayBuffer()
  );

  const { PDFDocument, StandardFonts } = PDFLib;

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const page = pages[0];

  // Get full text content
  const text = await pdfDoc.getForm();

  // Replace placeholders
  const content = await pdfDoc.saveAsBase64({ dataUri: false });

  let finalText = content
    .replace("{{DATE}}", dateInput)
    .replace("{{MONTH}}", monthInput);

  const newPdf = await PDFDocument.load(
    Uint8Array.from(atob(finalText), c => c.charCodeAt(0))
  );

  const pdfBytes = await newPdf.save();

  // Download
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "Compliance_Undertaking_Final.pdf";
  link.click();
}
