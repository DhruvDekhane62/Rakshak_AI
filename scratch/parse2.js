const fs = require('fs');
const PDFParser = require("pdf2json");

const pdfParser = new PDFParser(this, 1); // 1 = text mode

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync("./output.txt", pdfParser.getRawTextContent());
    console.log("Done extracting text to output.txt");
});

pdfParser.loadPDF("../Police_FIR_ER_Diagram.pdf");
