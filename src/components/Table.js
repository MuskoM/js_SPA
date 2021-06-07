import React, { useState } from "react";
import { useTable, useFilters, useSortBy } from "react-table";
import { FormControlLabel, TextField } from "@material-ui/core";
import { TextFormatRounded } from "@material-ui/icons";
import { PrimaryButton, SecondaryButton } from "./Buttons";

export default function Table({ columns, data }) {
  const [filterInput, setFilterInput] = useState("");
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter
  } = useTable(
    {
      columns,
      data
    },
    useFilters,
    useSortBy
  );

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("name", value);
    setFilterInput(value);
  };

  return (
    <>
      <div className="Aux-btn">
      <TextField
        value={filterInput}
        onChange={handleFilterChange}
        placeholder={"Search name"}
        type="search" label="Search"
        variant="filled"
        className="SearchBar"
      />
      </div>
      <table class="table" {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "sort-desc"
                        : "sort-asc"
                      : ""
                  }
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}