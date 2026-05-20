import { useMemo, useState } from "react";
import HeaderBtn from "../components/Buttons/HeaderBtn";
import CommonModal from "../components/Model";
import { userGetPayments, userGetSales } from "../hooks/customQuery";
import { type PaymentWithDetails, type Sale } from "../types";
import { useForm } from "react-hook-form";
import { paymentResolver, type PaymentFormData } from "../Schema";
import { useCreatePayment } from "../hooks/customMutation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";

const Payments = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: SaleData } = userGetSales(1, 10, "");
  const sales = SaleData?.data || [];
  const { mutate: createPayment } = useCreatePayment({ setIsModalOpen });
  const { data: PaymentsData } = userGetPayments({ page: 1, limit: 10 });

  console.log("PaymentsData", PaymentsData);
  const slaesOptions = sales.sales
    .filter((sale: Sale) => sale.status.toLowerCase() === "pending")
    .map((sale: Sale) => {
      return {
        label: `${sale.productName} - ${sale.clientName} - ${sale.total}`,
        value: sale.id,
      };
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: paymentResolver,
  });

  const onSubmit = (data: PaymentFormData) => {
    console.log("Payment Data:", data);
    createPayment(data);
  };

  const columns = useMemo<ColumnDef<PaymentWithDetails>[]>(
    () => [
      {
        accessorKey: "type",
        header: "Payment Type",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "clientName",
        header: "Client Name",
      },
      {
        header: "Sale ID",
        accessorKey: "saleId",
      },
      {
        header: "Paid Amount",
        accessorKey: "paidAmount",
      },
      {
        header: "Total Amount",
        accessorKey: "total",
      },
      {
        header: "Remaining Amount",
        accessorKey: "remaining",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: PaymentsData?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <span className="text-2xl font-semibold text-foreground">
            Payments
          </span>

          <span className="text-muted-foreground">
            Track payment collections
          </span>
        </div>

        <HeaderBtn
          btnName="+ Add Client"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl border border-muted-foreground h-[calc(100vh-200px)]">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      className="text-left p-4 border-b border-muted-foreground font-semibold"
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition duration-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 border-b border-gray-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CommonModal
        isOpen={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onSave={handleSubmit(onSubmit)}
        title={"Record Payment"}
      >
        <form className="flex flex-col gap-3">
          <div>
            <select
              {...register("sale_id", { valueAsNumber: true })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select a sale</option>
              {slaesOptions.map((option: { label: string; value: number }) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.sale_id && (
              <p className="text-red-500">{errors.sale_id.message}</p>
            )}
          </div>
          <div>
            <input
              {...register("amount", { valueAsNumber: true })}
              type="number"
              placeholder="Amount"
              className="w-full border p-2 rounded"
            />
            {errors.amount && (
              <p className="text-red-500">{errors.amount.message}</p>
            )}
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

export default Payments;
