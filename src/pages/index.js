import React, { useState } from 'react';
import CSVUploader from '../components/CSVUploader';
import CSVTable from '../components/CSVTable';
import styles from '../styles/Home.module.css'; // Import the new styles

export default function Home() {
  const [csvData, setCsvData] = useState(null);

  const handleFileLoaded = (data) => {
    setCsvData(data);
  };

  return (
    <div className={styles.home}>
      <h1 className={styles.heading}>CSV File Upload and Computation</h1>
      <CSVUploader onFileLoaded={handleFileLoaded} uploadButtonClassName={styles.uploadButton} />
      <CSVTable initialData={csvData} />
    </div>
  );
}
