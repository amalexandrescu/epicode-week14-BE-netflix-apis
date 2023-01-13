import PdfPrinter from "pdfmake";

export const getPDFReadableStream = (mediasArray, mediaId) => {
  // Define font files
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const content = mediasArray.map((media) => {
    if (media.imdbID === mediaId) {
      return [
        { text: media.title, style: "header" },
        { text: media.year, style: "subheader" },
        { text: media.type, style: "subheader" },
        { text: media.poster, style: "subheader" },
        "\n\n",
      ];
    }
  });

  const docDefinition = {
    content: [...content],
    defaultStyle: {
      font: "Helvetica",
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);
  pdfReadableStream.end();

  return pdfReadableStream;
};
