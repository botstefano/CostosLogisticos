const PDFDocument = require('pdfkit');
const ExcelJS = require('exceljs');

/**
 * Genera un PDF tabular a partir de columnas y filas, y lo envía como respuesta.
 * columnas: [{ key, label, width? }]
 * filas: array de objetos
 */
function generarPDF(res, { titulo, columnas, filas, filename = 'reporte.pdf' }) {
  const doc = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  doc.pipe(res);

  doc.fontSize(16).fillColor('#1e3a8a').text(titulo, { align: 'center' });
  doc.moveDown(0.5);
  doc.fontSize(9).fillColor('#555').text(`Generado: ${new Date().toLocaleString('es-PE')}`, { align: 'center' });
  doc.moveDown(1);

  const startX = doc.page.margins.left;
  let y = doc.y;
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const colWidth = pageWidth / columnas.length;

  const drawRow = (rowData, isHeader = false) => {
    let x = startX;
    doc.fontSize(8);
    if (isHeader) {
      doc.fillColor('#ffffff');
      doc.rect(startX, y, pageWidth, 20).fill('#1e3a8a');
      doc.fillColor('#ffffff');
    } else {
      doc.fillColor('#1f2937');
    }
    columnas.forEach((col) => {
      const value = rowData[col.key];
      doc.text(value === null || value === undefined ? '-' : String(value), x + 4, y + 5, {
        width: colWidth - 8,
        align: 'left',
      });
      x += colWidth;
    });
    y += 20;
  };

  drawRow(columnas.reduce((acc, c) => ({ ...acc, [c.key]: c.label }), {}), true);

  filas.forEach((fila, idx) => {
    if (y > doc.page.height - doc.page.margins.bottom - 30) {
      doc.addPage();
      y = doc.page.margins.top;
      drawRow(columnas.reduce((acc, c) => ({ ...acc, [c.key]: c.label }), {}), true);
    }
    if (idx % 2 === 1) {
      doc.rect(startX, y, pageWidth, 20).fill('#f1f5f9');
      doc.fillColor('#1f2937');
    }
    drawRow(fila);
  });

  doc.end();
}

/**
 * Genera un Excel (.xlsx) a partir de columnas y filas, y lo envía como respuesta.
 */
async function generarExcel(res, { titulo, columnas, filas, filename = 'reporte.xlsx' }) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(titulo.substring(0, 30));

  sheet.columns = columnas.map((c) => ({ header: c.label, key: c.key, width: c.width || 22 }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.eachCell((cell) => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    cell.alignment = { vertical: 'middle', horizontal: 'left' };
  });

  filas.forEach((fila) => sheet.addRow(fila));

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell) => {
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        };
      });
    }
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { generarPDF, generarExcel };
