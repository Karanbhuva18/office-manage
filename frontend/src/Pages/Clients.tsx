import { useMemo, useState } from "react";
import HeaderBtn from "../components/Buttons/HeaderBtn";
import { Search } from "lucide-react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useGetClients } from "../hooks/customQuery";
import useDebounce from "../hooks/useDebounce";
import CommonModal from "../components/Model";
import { useForm } from "react-hook-form";
import { clientResolver, type ClientFormData } from "../Schema";
import {
  useclientCreate,
  useDeleteClient,
  useUpdateClient,
} from "../hooks/customMutation";
import { useQueryClient } from "@tanstack/react-query";
const Clients = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const { data: clientsData } = useGetClients(1, 10, debouncedSearch);
  const { mutate: createClient } = useclientCreate();
  const { mutate: deleteClient } = useDeleteClient();
  const { mutate: updateClient } = useUpdateClient({setIsModalOpen});
  const queryClient = useQueryClient();
  // DUMMY DATA

  type Client = {
    id: number;
    name: string;
    email: string;
    phone: string;
    totalbusiness: number | null;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: clientResolver,
  });

  const filteredClients = useMemo(() => {
    return clientsData?.data || [];
  }, [clientsData]);

  const handleDelete = (id: number) => {
    deleteClient(id);
  };
  const columns = useMemo<ColumnDef<Client>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
      },
      {
        id: "name",
        accessorFn: (row) => row.name,
        header: "Name",
        cell: ({ row }) => (
          <span className="font-bold text-black">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-muted-foreground">{row.original.phone}</span>
        ),
      },
      {
        accessorKey: "totalbusiness",
        header: "Total Business",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex space-x-2">
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => handleEdit(row.original)}
            >
              Edit
            </button>
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    [],
  );

  // TANSTACK TABLE
  const table = useReactTable({
    data: filteredClients,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onSubmitclient = (data: ClientFormData) => {
    if (selectedClient) {
      // UPDATE API
      updateClient({
        id: selectedClient.id,
        ...data,
      });
    } else {
      // CREATE API
      createClient(data, {
        onSuccess: () => {
          reset();

          setIsModalOpen(false);

          queryClient.invalidateQueries({
            queryKey: ["clients"],
          });
        },
      });
    }
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);

    reset({
      name: client.name,
      email: client.email,
      phone: client.phone,
    });

    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <span className="text-2xl font-semibold text-foreground">
            Clients
          </span>

          <span className="text-muted-foreground">
            Manage your client relationships
          </span>
        </div>

        <HeaderBtn
          btnName="+ Add Client"
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {/* SEARCH */}
      <div className="relative mt-4">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          size={18}
        />

        <input
          type="text"
          placeholder="Search Client..."
          value={search}
          onChange={handleSearch}
          className="w-80 ps-10 py-2 rounded-md border border-muted-foreground outline-none focus:ring-2 focus:ring-muted-foreground"
        />
      </div>

      {/* TABLE */}
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
      <CommonModal
        isOpen={isModalOpen}
        title={selectedClient ? "Edit Client" : "Add Client"}
        onSave={handleSubmit(onSubmitclient)}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedClient(null);

          reset({
            name: "",
            email: "",
            phone: "",
          });
        }}
      >
        <form>
          <div className="flex flex-col gap-3">
            <div>
              <input
                type="text"
                {...register("name")}
                placeholder="Enter client name"
                className="border p-2 rounded-md w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="email"
                {...register("email")}
                placeholder="Enter email"
                className="border p-2 rounded-md w-full"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <input
                type="text"
                {...register("phone")}
                placeholder="Enter phone number"
                className="border p-2 rounded-md w-full"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

export default Clients;
