import FileSaver from "file-saver";
import XLSX from "sheetjs-style";
import Button from '@mui/material/Button';
import PrintIcon from "@mui/icons-material/Print";

function ExcelExport({ excelData, fileName }) {

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    async function exportToExcel(fileName) {
        const ws = XLSX.utils.json_to_sheet(excelData);
        const wb = XLSX.utils.book_new();  // Create a new workbook object
        XLSX.utils.book_append_sheet(wb, ws, 'data');  // Append the worksheet to the workbook
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }
    
    return (
        <Button variant="outlined" onClick={(e) => exportToExcel(fileName)} startIcon={<PrintIcon/>} >.XLSX</Button>
    )
}

export default ExcelExport;