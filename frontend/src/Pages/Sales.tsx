import { useMemo, useState } from "react";
import HeaderBtn from "../components/Buttons/HeaderBtn";
import CommonModal from "../components/Model";
import { useForm } from "react-hook-form";
import { salesResolver, type SalesFormData } from "../Schema";
import {
  useGetClients,
  useGetProducts,
  userGetSales,
} from "../hooks/customQuery";
import type { Product, Client, Sale } from "../types";
import { useCreateSale } from "../hooks/customMutation";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
const Sales = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("");
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm<SalesFormData>({
    resolver: salesResolver,
  });
  const { mutate: createSaleMutation } = useCreateSale({ setIsModalOpen });
  const { data: productsData } = useGetProducts(1, 10, "");
  const { data: clientsData } = useGetClients(1, 10, "");
  const clients = clientsData?.data || [];
  const products = productsData?.data || [];

  const productOptions = products.map((product: Product) => {
    return {
      label: `${product.name} - ${product.Price}`,
      value: product.id,
    };
  });

  const { data: clientData } = userGetSales(1, 10, status);
  const sales = clientData?.data.sales || [];

  const columns = useMemo<ColumnDef<Sale>[]>(
    () => [
      {
        accessorKey: "productName",
        header: "Product",
      },
      {
        accessorKey: "clientName",
        header: "Client",
      },
      {
        accessorKey: "total",
        header: "Amount",
      },
      {
        accessorKey: "status",
        header: "Status",
      },
      {
        accessorKey: "type",
        header: "Type",
      },
      {
        accessorKey: "sale_date",
        header: "Date",
        cell: ({ row }) => {
          const date = new Date(row.getValue("sale_date"));

          return <span>{date.toLocaleDateString("en-GB")}</span>;
        },
      },
    ],
    [],
  );
  const table = useReactTable({
    data: sales,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const clientOptions = clients.map((client: Client) => {
    return {
      label: client.name,
      value: client.id,
    };
  });

  const onSubmit = (data: SalesFormData) => {
    createSaleMutation(data, {
      onSuccess: () => {
        reset({
          productId: 0,
          clientId: 0,
          amount: 0,
          sallerId: 0,
          paymentType: "prepaid",
        });

        setIsModalOpen(false);
      },
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <span className="text-2xl font-semibold text-foreground">
            Products & Services
          </span>

          <span className="text-muted-foreground">Manage your offerings</span>
        </div>

        <HeaderBtn
          btnName="+ Add Product"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={() => setStatus("")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            status === ""
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setStatus("paid")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            status === "paid"
              ? "bg-green-600 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Paid
        </button>

        <button
          onClick={() => setStatus("pending")}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            status === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Pending
        </button>
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
        title={"Add Service"}
      >
        <form className="flex flex-col gap-3">
          <div>
            <select
              {...register("productId", { valueAsNumber: true })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select a product</option>
              {productOptions.map(
                (option: { label: string; value: number }) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ),
              )}
            </select>
            {errors.productId && (
              <p className="text-red-500">{errors.productId.message}</p>
            )}
          </div>
          <div>
            <select
              {...register("clientId", { valueAsNumber: true })}
              className="w-full border p-2 rounded"
            >
              <option value="">Select a client</option>
              {clientOptions.map((option: { label: string; value: number }) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.clientId && (
              <p className="text-red-500">{errors.clientId.message}</p>
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
          <div>
            <select
              {...register("paymentType")}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Payment Type</option>
              <option value="prepaid">Prepaid</option>
              <option value="postpaid">Postpaid</option>
            </select>

            {errors.paymentType && (
              <p className="text-red-500">{errors.paymentType.message}</p>
            )}
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

export default Sales;
