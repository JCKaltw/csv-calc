import React, { useState } from 'react';
import Papa from 'papaparse';

const CSVUploader = ({ onFileLoaded, uploadButtonClassName }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!file) return;
    Papa.parse(file, {
      complete: (results) => {
        const data = results.data.slice(0, -1); // Remove the last row
        onFileLoaded(data);
      },
      header: true,
      dynamicTyping: true,
    });
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button className={uploadButtonClassName} onClick={handleFileUpload}>
        Upload CSV
      </button>
    </div>
  );
};

export default CSVUploader;
