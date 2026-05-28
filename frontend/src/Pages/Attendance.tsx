import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import React, { useMemo } from "react";
import { userGetAttendance } from "../hooks/customQuery";
import type { Attendance, Client } from "../types";
import { format } from "date-fns";
import { LogIn } from "lucide-react";
import { useMarkAttendance } from "../hooks/customMutation";

const Attendance = () => {
  const [date, setDate] = React.useState(new Date());
  const { data: attendanceData } = userGetAttendance({
    date: date.toISOString().split("T")[0],
  } as { date: string });
  const { mutate: markAttendance } = useMarkAttendance();

  const handleMarkAttendance = () => {
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });
    markAttendance(currentTime);
  };
  const columns = useMemo<ColumnDef<Attendance>[]>(
    () => [
      {
        id: "name",
        accessorFn: (row) => row.name,
        header: "Name",
        cell: ({ row }) => (
          <span className="font-bold text-black">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {format(new Date(row.original.date), "dd-MM-yyyy")}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "check_in",
        header: "Check In",
        cell: ({ row }) => {
          const isToday =
            format(new Date(row.original.date), "yyyy-MM-dd") ===
            format(new Date(), "yyyy-MM-dd");

          return row.original.check_in ? (
            <span className="text-muted-foreground">
              {format(
                new Date(`1970-01-01T${row.original.check_in}`),
                "HH:mm:ss",
              )}
            </span>
          ) : isToday ? (
            <button
              onClick={handleMarkAttendance}
              className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-100"
            >
              <LogIn size={16} />
              Check In
            </button>
          ) : (
            <span className="text-muted-foreground">--</span>
          );
        },
      },
      {
        accessorKey: "check_out",
        header: "Check Out",
        cell: ({ row }) => {
          const isToday =
            format(new Date(row.original.date), "yyyy-MM-dd") ===
            format(new Date(), "yyyy-MM-dd");
          console.log("isToday", isToday,'row.original.date',row.original.date);
          return row.original.check_out ? (
            <span className="text-muted-foreground">
              {format(
                new Date(`1970-01-01T${row.original.check_out}`),
                "HH:mm:ss",
              )}
            </span>
          ) : isToday ? (
            <button
              onClick={handleMarkAttendance}
              className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-gray-100"
            >
              <LogIn size={16} />
              Check Out
            </button>
          ) : (
            <span className="text-muted-foreground">--</span>
          );
        },
      },
      {
        id: "total_hours",
        header: "Total Hours",
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.total_hours?.toFixed(2) || "--"}
          </span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: attendanceData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <span className="text-2xl font-semibold text-foreground">
            Attendance
          </span>

          <span className="text-muted-foreground">
            Track employee check-ins and check-outs
          </span>
        </div>
        <input
          type="date"
          value={date.toISOString().split("T")[0]}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="border rounded-md px-3 py-2"
        />
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-muted-foreground h-[calc(100vh-200px)]">
        <table className="w-full border-collapse">
          {/* TABLE HEADER */}
          <thead className="bg-gray-100 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left p-4 border-b border-muted-foreground font-semibold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-4 border-b border-gray-200">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center p-4">
                  No Clients Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Attendance;
