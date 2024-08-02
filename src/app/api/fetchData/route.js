import fs from "fs";
import path from "path";
import * as xlsx from "xlsx";
import NodeCache from "node-cache";

// Initialize cache
const cache = new NodeCache({ stdTTL: 3600 }); // Cache data for 1 hour

export async function GET(req) {
  try {
    // Check cache first
    const cachedData = cache.get("excelData");
    if (cachedData) {
      return new Response(JSON.stringify(cachedData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const filePath = path.resolve("./public/FMSCA_records.xlsx");

    if (!fs.existsSync(filePath)) {
      return new Response(JSON.stringify({ error: "File does not exist" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const file = fs.readFileSync(filePath);

    const workbook = xlsx.read(file, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // Assuming you want to read the first sheet
    const sheet = workbook.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(sheet);

    // Cache the data
    cache.set("excelData", jsonData);

    return new Response(JSON.stringify(jsonData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to read Excel file:", error);
    return new Response(JSON.stringify({ error: "Failed to read Excel file" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
