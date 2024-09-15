import React, { useEffect, useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';

// Define the type for artwork data
interface ArtworkData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: string;
  date_end: string;
}

const Page: React.FC = () => {
  const totalRecords = 126079; // Total records count from API
  const [page, setPage] = useState<number>(1); // Track current page
  const [selectedRows, setSelectedRows] = useState<ArtworkData[]>([]); // Global selected rows
  const [data, setData] = useState<ArtworkData[]>([]); // Data for the current page
  const [rowsToSelect, setRowsToSelect] = useState<number>(); // Number of rows to select from input
  const rowsPerPage = 12; // Set rows per page to 12 (constant)

  // Fetch artwork data from API based on current page
  const fetchPage = async (pageNumber: number) => {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    };

    try {
      const response = await fetch(`https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=${rowsPerPage}`, options);
      const result = await response.json();
      return result.data;
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  // Fetch data for the current page
  useEffect(() => {
    fetchPage(page).then((fetchedData) => {
      setData(fetchedData);
    });
  }, [page]);

  // Handle selecting rows across multiple pages
  const handleSelectRows = async () => {
    let totalSelected = 0;
    const selectedArtworks: ArtworkData[] = [];
    let currentPage = 1; // Start from the first page

    while (totalSelected < rowsToSelect) {
      const pageData = await fetchPage(currentPage);
      
      for (const row of pageData) {
        if (totalSelected < rowsToSelect) {
          selectedArtworks.push(row);
          totalSelected++;
        } else {
          break;
        }
      }

      if (pageData.length < rowsPerPage || totalSelected >= rowsToSelect) {
        break;
      }
      currentPage++;
    }

    setSelectedRows(selectedArtworks);
    setPage(1); // Reset to the first page after selection
    fetchPage(1).then((fetchedData) => {
      setData(fetchedData);
    });
  };

  // Handle input change for number of rows to select
  const handleRowsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value, 10);
    if (!isNaN(count)) {
      setRowsToSelect(count);
    }
  };

  const op = useRef<OverlayPanel>(null);

  return (
    <div className="card">
      <div className="card flex justify-content-center">
        <Button
          type="button"
          icon="pi pi-image"
          className="bg-slate-300 p-3"
          label="Select Rows"
          onClick={(e) => op.current?.toggle(e)}
        />
        <OverlayPanel ref={op}>
          <input
            type="text"
            // value={rowsToSelect }
            onChange={handleRowsInputChange}
            placeholder="Enter Rows"
            className="p-2 border-black"
          />
          <Button label="Select" onClick={handleSelectRows} className="bg-slate-400 p-1 m-1" />
        </OverlayPanel>
      </div>

      <DataTable   className=''
        value={data}
        selection={selectedRows}
        onSelectionChange={(e) => setSelectedRows(e.value)}
        dataKey="id"
        tableStyle={{ minWidth: '50rem' }}
      >
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place of Origin"></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" style={{minWidth:"20rem"}} header="Inscriptions"></Column>
        <Column field="date_start" header="Date Start"></Column>
        <Column field="date_end" header="Date End"></Column>
      </DataTable>

      <div className="pagination my-10 cursor-pointer">
        <span className={page === 1 ? 'hidden' : 'mx-5 p-2 bg-slate-300'} onClick={() => setPage(1)}>
          ←←
        </span>
        <span className={page === 1 ? 'hidden' : 'mx-5 p-2 bg-slate-300'} onClick={() => setPage(page - 1)}>
          ←
        </span>
        <span className={page === 1 ? 'hidden' : 'mx-5 p-2 bg-slate-300'} onClick={() => setPage(page - 1)}>
          {page - 1}
        </span>
        <span className="p-2 bg-slate-400">
          {page} out of {Math.ceil(totalRecords / rowsPerPage)} pages
        </span>
        <span
          className={page === Math.ceil(totalRecords / rowsPerPage) ? 'hidden' : 'mx-5 p-2 bg-slate-300'}
          onClick={() => setPage(page + 1)}
        >
          {page + 1}
        </span>
        <span
          className={page === Math.ceil(totalRecords / rowsPerPage) ? 'hidden' : 'mx-5 p-2 bg-slate-300'}
          onClick={() => setPage(page + 1)}
        >
          →
        </span>
        <span
          className={page === Math.ceil(totalRecords / rowsPerPage) ? 'hidden' : 'mx-5 p-2 bg-slate-300'}
          onClick={() => setPage(Math.ceil(totalRecords / rowsPerPage))}
        >
          →→
        </span>
      </div>
    </div>
  );
};

export default Page;