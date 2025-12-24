import React from 'react';
import {
 flexRender,
 getCoreRowModel,
 useReactTable,
} from '@tanstack/react-table';

const Table = ({ data, columns, isLoading = false }) => {
 const table = useReactTable({
 data,
 columns,
 getCoreRowModel: getCoreRowModel(),
 });

 if (isLoading) {
 return (
 <div className="animate-pulse">
 <div className="h-10 bg-gray-200 rounded-t-lg mb-2"></div>
 {[...Array(5)].map((_, i) => (
 <div key={i} className="h-16 bg-gray-100 rounded-lg mb-2"></div>
 ))}
 </div>
 );
 }

 return (
 <div className="overflow-hidden -200 rounded-lg">
 <div className="overflow-x-auto scrollbar-thin">
 <table className="min-w-full divide-y divide-gray-200">
 <thead className="bg-gray-50">
 {table.getHeaderGroups().map((headerGroup) => (
 <tr key={headerGroup.id}>
 {headerGroup.headers.map((header) => (
 <th
 key={header.id}
 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
 >
 {flexRender(
 header.column.columnDef.header,
 header.getContext()
 )}
 </th>
 ))}
 </tr>
 ))}
 </thead>
 <tbody className="bg-white divide-y divide-gray-200">
 {table.getRowModel().rows.map((row) => (
 <tr key={row.id} className="hover:bg-gray-50 transition-colors">
 {row.getVisibleCells().map((cell) => (
 <td
 key={cell.id}
 className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
 >
 {flexRender(cell.column.columnDef.cell, cell.getContext())}
 </td>
 ))}
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
};

export default Table;