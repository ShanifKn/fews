"use client";

import Image from "next/image";
import FMCSATable from "./components/FMCSATable";
import { useEffect, useState } from "react";
import Papa from "papaparse";
import Error from "next/error";

async function fetchExcelData() {
  const response = await fetch("/api/fetchData");
  if (!response.ok) {
    return;
  }
  const result = await response.json();
  return result;
}

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      try {
        const result = await fetchExcelData();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    getData();
  }, []);

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">FMCSA Viewer</h1>
      <FMCSATable data={data} />
    </div>
  );
}
