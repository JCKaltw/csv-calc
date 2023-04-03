import React, { useState } from 'react';
import Papa from 'papaparse';
import styles from '../styles/Home.module.css'; // Import the new styles

const CSVUploader = ({ onFileLoaded }) => {
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
    <div className={styles['file-input']}>
      <input type="file" id="file-upload" accept=".csv" onChange={handleFileChange} />
      <label htmlFor="file-upload" className={styles['label']}> {/* Update this line */}
        Browse...
      </label>
      <span>
        {file ? file.name : 'No files selected'}
      </span>
      <button className={styles['uploadButton']} onClick={handleFileUpload}>
        Upload CSV
      </button>
    </div>
  );
};

export default CSVUploader;
