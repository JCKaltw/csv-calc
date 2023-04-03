import React, { useState, useEffect } from "react";

const CSVTable = ({ initialData }) => {
  const [data, setData] = useState(initialData);
  const [history, setHistory] = useState([]);
  const [result, setResult] = useState(null);
  const [headers, setHeaders] = useState(initialData && initialData.length > 0 ? Object.keys(initialData[0]) : []);

  useEffect(() => {
    setData(initialData);
    if (initialData && initialData.length > 0) {
      setHeaders(Object.keys(initialData[0]));
    } else {
      setHeaders([]);
    }
  }, [initialData]);

  if (!data || data.length === 0) return null;

  const addColumn = (columnName, columnLetter, startVal, incVal) => {
    const columnIndex = colLetterToIndex(columnLetter);
    const newData = data.map((row, rowIndex) => {
      const newRow = { ...row };
      newRow[columnName] = startVal + rowIndex * incVal;
  
      const updatedRow = {};
      let newColumnInserted = false;
      let keys = Object.keys(newRow);
  
      for (let i = 0, j = 0; i < keys.length; i++, j++) {
        if (j === columnIndex && !newColumnInserted) {
          updatedRow[columnName] = newRow[columnName];
          newColumnInserted = true;
          i--;
        } else {
          updatedRow[keys[i]] = newRow[keys[i]];
        }
      }
  
      if (!newColumnInserted) {
        updatedRow[columnName] = newRow[columnName];
      }
  
      return updatedRow;
    });
  
    setData(newData);
    setHeaders(Object.keys(newData[0]));
    setHistory([...history, { data: newData, visible: false }]);
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

  const toggleTableVisibility = (index) => {
    setHistory(
      history.map((item, itemIndex) =>
        itemIndex === index ? { ...item, visible: !item.visible } : item
      )
    );
  };

  return (
    <div>
      {history.map((tableData, index) => (
        <div key={index}>
          <button onClick={() => toggleTableVisibility(index)}>
            {tableData.visible ? "Hide" : "Show"} Table {index + 1}
          </button>
          {tableData.visible && (
            <Table data={tableData.data} headers={headers} />
          )}
        </div>
      ))}
      <Table data={data} headers={headers} />
      <CommandInput
        onResult={setResult}
        addColumn={addColumn}
        sumColumn={sumColumn}
      />
      {result && <p>Result: {result}</p>}
    </div>
  );
};

const Table = ({ data, headers }) => (
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
);

const compute = (command, addColumnFn, sumColumnFn) => {
  const commandParts = command.split(" ");
  const operation = commandParts[0].toLowerCase();

  if (operation === "sum") {
    const colLetter = commandParts[1].toUpperCase();
    const columnIndex = colLetterToIndex(colLetter);
    return sumColumnFn(columnIndex);
  } else if (operation === "add") {
    const columnExpression = commandParts.slice(1).join(" ");

    const [columnName, colLetter] = extractColumnNameAndLetter(columnExpression);
    const columnIndex = colLetterToIndex(String(colLetter).toUpperCase()); // Convert colLetter to a string and then to uppercase

    const [startVal, incVal] = columnName
      ? columnExpression
          .split(/\s+/)
          .slice(2)
          .map((val) => parseInt(val))
      : [1, 1];

    addColumnFn(columnName, colLetter, startVal || 1, incVal || 1); // Pass colLetter instead of columnIndex

    return "Column added successfully";
  }

  return "Invalid command";
};

const extractColumnNameAndLetter = (columnExpression) => {
  const columnName = columnExpression.match(/"[^"]+"/g)?.[0]?.replace(/"/g, "") || "";
  const colLetter = columnExpression.replace(/"[^"]+"/g, "").match(/[A-Z]+/i)?.[0] || "";
  return [columnName, colLetter];
};

const colLetterToIndex = (colLetter, returnName = false) => {
  let columnName = String(colLetter).match(/"[^"]+"/g); // Convert colLetter to a string
  columnName = columnName ? columnName[0].replace(/"/g, "") : "";

  const letters = String(colLetter).match(/[A-Z]+/i); // Extract only the column letters

  let columnIndex = 0;
  if (letters) {
    for (let i = 0; i < letters[0].length; i++) {
      columnIndex =
        columnIndex * 26 + (letters[0].charCodeAt(i) - "A".charCodeAt(0) + 1);
    }
  }
  columnIndex = columnIndex - 1;
  if (isNaN(columnIndex) || columnIndex < 0) columnIndex = 0;

  const returnValue = returnName ? [columnName, columnIndex] : columnIndex;
  return returnValue;
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
        placeholder="Enter command"
      />
      <button onClick={handleCompute}>Compute</button>
    </div>
  );
};

export default CSVTable;

