import React, { useState, useEffect } from "react";

const CSVTable = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [result, setResult] = useState(null);

  useEffect(() => { // Add this useEffect hook
    setData(initialData);
  }, [initialData]); // Pass initialData as a dependency

  if (!data || data.length === 0) return null;

  const headers = Object.keys(data[0]);

  const addColumn = (columnName, columnLetter, startVal, incVal) => {
    const columnIndex = colLetterToIndex(columnLetter);
    const newData = data.map((row, rowIndex) => {
      const newRow = { ...row };
      newRow[columnName] = startVal + rowIndex * incVal;
  
      const updatedRow = {};
      for (let i = 0, j = 0; i < Object.keys(newRow).length; i++, j++) {
        if (j === columnIndex) {
          updatedRow[columnName] = newRow[columnName];
          j++;
        }
        updatedRow[Object.keys(newRow)[i]] = newRow[Object.keys(newRow)[i]];
      }
  
      return updatedRow;
    });
  
    setData(newData); // Update the state with newData
  };
  
  const sumColumn = (columnIndex) => {
    if (isNaN(columnIndex) || columnIndex < 0) return "Invalid column index";

    let sum = 0;
    data.forEach((row) => {
      const value = parseFloat(row[Object.keys(row)[columnIndex]]);
      if (!isNaN(value)) sum += value;
    });
    return sum;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, index) => (
                <td key={index}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <CommandInput
        onResult={setResult}
        addColumn={addColumn}
        sumColumn={sumColumn}
      />
      {result && <p>Result: {result}</p>}
    </div>
  );
};

const compute = (command, addColumnFn, sumColumnFn) => {
  const commandParts = command.split(" ");
  const operation = commandParts[0].toLowerCase();

  if (operation === "sum") {
    const colLetter = commandParts[1].toUpperCase();
    const columnIndex = colLetterToIndex(colLetter);
    return sumColumnFn(columnIndex);
  } else if (operation === "add") {
    const columnExpression = commandParts.slice(1).join(" ");
    const [columnName, columnIndex] = colLetterToIndex(columnExpression, true);
    const [startVal, incVal] = columnName
      ? columnExpression
          .split(/\s+/)
          .slice(2)
          .map((val) => parseInt(val))
      : [1, 1];

    addColumnFn(columnName, columnIndex, startVal || 1, incVal || 1);

    return "Column added successfully";
  }

  return "Invalid command";
};

const colLetterToIndex = (colLetter, returnName = false) => {
  let columnName = String(colLetter).match(/"[^"]+"/g); // Convert colLetter to a string
  columnName = columnName ? columnName[0].replace(/"/g, "") : "";

  const letters = String(colLetter).replace(/"[^"]+"/g, "").toUpperCase(); // Convert colLetter to a string
  let columnIndex = 0;
  for (let i = 0; i < letters.length; i++) {
    columnIndex =
      columnIndex * 26 + (letters.charCodeAt(i) - "A".charCodeAt(0) + 1);
  }
  return returnName ? [columnName, columnIndex - 1] : columnIndex - 1;
};

const CommandInput = ({ onResult, addColumn, sumColumn }) => {
  const [command, setCommand] = useState("");

  const handleChange = (e) => {
    setCommand(e.target.value);
  };

  const handleCompute = () => {
    const result = compute(command, addColumn, sumColumn);
    onResult(result);
  };

  return (
    <div>
      <input
        type="text"
        value={command}
        onChange={handleChange}
        placeholder="Enter command (e.g., Sum:1)"
      />
      <button onClick={handleCompute}>Compute</button>
    </div>
  );
};

export default CSVTable;
