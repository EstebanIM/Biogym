import React, { useState } from 'react';

export const ResponsiveTable = ({ headers, rows }) => {
  const [currentPage] = useState(1);
  const itemsPerPage = 5;

  // Calcular los productos para la página actual
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = rows.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="overflow-x-auto w-full">
      {/* Tabla para pantallas grandes */}
      <table className="min-w-full table-auto hidden md:table">
        <thead>
          <tr className="bg-gray-200 text-gray-700 uppercase text-xs leading-normal">
            {headers.map((header, index) => (
              <th key={index} className="py-3 px-6 text-left font-semibold">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm">
          {currentItems.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="py-3 px-6 text-left">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tarjetas para pantallas pequeñas */}
      <div className="md:hidden space-y-4">
        {currentItems.map((row, rowIndex) => (
          <div key={rowIndex} className="bg-white shadow-md rounded-lg p-4">
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className="flex justify-between py-2">
                <span className="font-medium text-gray-600">{headers[cellIndex]}</span>
                <span className="text-gray-800">{cell}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
