import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

type Column<T> = {
  header: string;
  accessor: (row: T) => React.ReactNode;
  align?: 'left' | 'right' | 'center';
};

type DataTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (row: T) => string | number;
};

export default function DataTable<T>({ data, columns, keyExtractor }: DataTableProps<T>) {
  return (
    <TableContainer component={Paper} sx={{ mt: 1 }}>
      <Table sx={{ minWidth: 650 }} aria-label="generic table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.header} align={column.align || 'left'} sx={{ fontWeight: '600' }}>
                {column.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={keyExtractor(row)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              {columns.map((column) => (
                <TableCell key={column.header} align={column.align || 'left'}>
                  {column.accessor(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}