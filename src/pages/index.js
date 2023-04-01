import React, { useState } from 'react';
import CSVUploader from '../components/CSVUploader';
import CSVTable from '../components/CSVTable';

export default function Home() {
  const [csvData, setCsvData] = useState(null);

  const handleFileLoaded = (data) => {
    setCsvData(data);
  };

  return (
    <div>
      <h1>CSV File Upload and Computation</h1>
      <CSVUploader onFileLoaded={handleFileLoaded} />
      <CSVTable initialData={csvData} />
    </div>
  );
}
