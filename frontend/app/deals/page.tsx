"use client";

import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';

// Register all Community features
ModuleRegistry.registerModules([AllCommunityModule]);

import { useEffect, useState, useCallback, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

interface Deal {
  id: number;
  name: string;
  amount: number;
}

export default function DealsPage() {
  const [rowData, setRowData] = useState<Deal[]>([]);
  const gridRef = useRef<AgGridReact<Deal>>(null);

  const columnDefs = [
    { field: "id", headerName: "ID", editable: false, width: 80 },
    { field: "name", headerName: "Name", editable: true, flex: 1 },
    { field: "amount", headerName: "Amount", editable: true, flex: 1, type: "numericColumn" },
  ];

  // Fetch deals from backend
  const fetchDeals = useCallback(async () => {
    const res = await fetch("/api/deals");
    if (res.ok) {
      setRowData(await res.json());
    }
  }, []);

  useEffect(() => {
    fetchDeals();
    const interval = setInterval(fetchDeals, 2000); // Poll every 2s for near real-time
    return () => clearInterval(interval);
  }, [fetchDeals]);

  // Add new deal
  const addDeal = async () => {
    const name = prompt("Deal name?");
    if (!name) return;
    const amountStr = prompt("Amount?");
    const amount = Number(amountStr);
    if (!amountStr || isNaN(amount)) return;
    const res = await fetch("/api/deals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, amount }),
    });
    if (res.ok) fetchDeals();
  };

  // Update deal on cell edit
  const onCellValueChanged = async (event: any) => {
    const { data } = event;
    await fetch(`/api/deals/${data.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name, amount: data.amount }),
    });
    fetchDeals();
  };

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <h1 className="text-2xl font-bold mb-4">Deals</h1>
      <button onClick={addDeal} className="mb-2 px-4 py-2 bg-blue-600 text-white rounded">Add Deal</button>
      <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={columnDefs}
          onCellValueChanged={onCellValueChanged}
          stopEditingWhenCellsLoseFocus={true}
          domLayout="autoHeight"
        />
      </div>
    </div>
  );
}

