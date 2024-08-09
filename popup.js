document.getElementById('extract').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: extractTableData
      }, (results) => {
        const data = results[0].result;
        const csv = data.map(row => row.join(",")).join("\n");
        downloadCSV(csv);
      });
    });
  });
  
  function downloadCSV(csv) {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  function extractTableData() {
    const table = document.querySelector('#DataTables_Table_1');
    const rows = table.querySelectorAll('tbody tr');
    const data = [];
  
    rows.forEach(row => {
      const cols = row.querySelectorAll('td');
      const rowData = [];
      
      // Pega apenas o primeiro e segundo valor de cada linha
      if (cols.length > 0) {
        const values = cols[0].innerText.trim().split(" ");
        rowData.push(values[0] || "");  // Primeiro valor da célula
        rowData.push(values[1] || "");  // Segundo valor da célula
      }
      if (cols.length > 1) {
        const values = cols[1].innerText.trim().split(" ");
        rowData.push(values[0] || "");  // Primeiro valor da célula
        rowData.push(values[1] || "");  // Segundo valor da célula
      }
      
      data.push(rowData);
    });
  
    return data;
  }  