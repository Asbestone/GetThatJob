import { NextRequest, NextResponse } from "next/server";
import {promises as fs} from "fs";
import {v4 as uuidv4} from "uuid";
import PDFParser from "pdf2json";
import os from "os";
import path from "path";

export const config = {
    api: {
      bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const formData: FormData = await req.formData();
    const uploadedFiles = formData.getAll("filepond");
    let fileName = "";
    let parsedText = "";
  
    if (uploadedFiles && uploadedFiles.length > 0) {
      // use first uploaded file at idx 0
      const uploadedFile = uploadedFiles[0];
  
      if (uploadedFile instanceof File) {
        console.log("Uploaded file is of type File");
  
        // storing pdf temporarily with unique id
        fileName = uuidv4();
        const tempFilePath = path.join(os.tmpdir(), `${fileName}.pdf`);
  
        // convert uploaded arraybuffer to node buffer
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const fileBuffer = Buffer.from(arrayBuffer);
  
        //write buffer as temp pdf file
        await fs.writeFile(tempFilePath, fileBuffer);
  
        const pdfParser = new PDFParser(null, true);
  
        const parsingPromise = new Promise<string>((resolve, reject) => {
          console.log("In the promise: waiting for PDF parsing events...");
  
          pdfParser.on("pdfParser_dataError", (errData: any) => {
            console.error("Error during PDF parsing:", errData.parserError);
            reject(errData.parserError);
          });
  
          pdfParser.on("pdfParser_dataReady", () => {
            parsedText = pdfParser.getRawTextContent();
            console.log("Parsed Text:", parsedText);
            resolve(parsedText);
          });
        });
  
        pdfParser.loadPDF(tempFilePath);
  
        try {
          parsedText = await parsingPromise;
        } catch (error) {
          return NextResponse.json({ error: "Error parsing PDF" }, { status: 500 });
        }
      } else {
        console.log("Uploaded file is not in the expected format.");
        return NextResponse.json({ error: "Invalid file format." }, { status: 400 });
      }
    } else {
      console.log("No files found in the request.");
      return NextResponse.json({ error: "No files uploaded." }, { status: 400 });
    }
  
    console.log("PDF parsed successfully. Parsed text is ready.");
    return NextResponse.json({ parsedText, fileName });
}