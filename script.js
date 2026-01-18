let processing = false;

async function fillPDF() {
  if (processing) return;
  processing = true;

  const btn = document.getElementById("downloadBtn");
  btn.disabled = true;
  btn.innerText = "Generating PDF...";

  const dateEl = document.getElementById("date");
  const monthEl = document.getElementById("month");

  dateEl.classList.remove("error");
  monthEl.classList.remove("error");

  if (!dateEl.value.trim() || !monthEl.value.trim()) {
    if (!dateEl.value.trim()) dateEl.classList.add("error");
    if (!monthEl.value.trim()) monthEl.classList.add("error");
    alert("Please fill Date and Month");
    btn.disabled = false;
    btn.innerText = "Download PDF";
    processing = false;
    return;
  }

  try {
    const pdfBytes = await fetch("Compliance_Undertaking.pdf", { cache: "no-store" })
      .then(r => r.arrayBuffer());

    const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    const font = await pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);

    /* ========= DATE (EXACT POSITION) ========= */
    page.drawText(dateEl.value, {
      x: 430,   // ← Date position (right side)
      y: 705,
      size: 11,
      font,
      color: PDFLib.rgb(0, 0, 0)
    });

    /* ========= MONTH (EXACT POSITION) ========= */
    page.drawText(monthEl.value, {
      x: 260,   // ← Month position (paragraph line)
      y: 575,
      size: 11,
      font,
      color: PDFLib.rgb(0, 0, 0)
    });

    const finalPdf = await pdfDoc.save();
    const blob = new Blob([finalPdf], { type: "application/pdf" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Compliance_Undertaking_Final.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();

  } catch (e) {
    alert("PDF generate error");
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.innerText = "Download PDF";
    processing = false;
  }
}
