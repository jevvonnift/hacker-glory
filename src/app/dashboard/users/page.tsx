"use client";

import useSession from "~/hooks/useSession";
import { api } from "~/trpc/react";
import {
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
} from "@tanstack/react-table";
import type { RouterOutputs } from "~/trpc/shared";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableDetail,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/Table";
import Input from "~/components/Input";
import toast from "react-hot-toast";

type User = RouterOutputs["user"]["getAll"][number];

const DashboardUsersPage = () => {
  const {
    data: users,
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = api.user.getAll.useQuery();
  const { data: roles } = api.role.getAll.useQuery();
  const { session } = useSession();
  const { mutate: updateUserRole } = api.user.updateRole.useMutation();

  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateUserRole = (id: string, roleId: number) => {
    setIsLoading(true);

    updateUserRole(
      {
        id,
        roleId,
      },
      {
        async onSuccess() {
          await refetchUsers();
          toast.success("Berhasil mengubah role pengguna.");
          setIsLoading(false);
        },
        onError() {
          toast.error("Gagal mengubah role pengguna.");
          setIsLoading(false);
        },
      },
    );
  };

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "username",
      header: "Username",
      cell: ({ row }) => <div>{row.getValue("username")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      header: "Role",
      cell: ({ row }) => (
        <div>
          {session && (
            <select
              className="cursor-pointer rounded-md border px-3 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              disabled={
                (session && session.user.id === row.original.id) || isLoading
              }
              value={row.original.roles.id}
              onChange={(e) => {
                handleUpdateUserRole(row.original.id, parseInt(e.target.value));
              }}
            >
              {roles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          )}
        </div>
      ),
    },
  ];

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: users ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-semibold">Pengguna</h1>

      <div className="mt-4 w-full">
        <Input
          placeholder="Filter username..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>

      <div className="mt-4 rounded-xl border bg-white">
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoadingUsers && (
                <TableRow>
                  <TableDetail
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading Data User ...
                  </TableDetail>
                </TableRow>
              )}

              {!isLoadingUsers && !users?.length && (
                <TableRow>
                  <TableDetail
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableDetail>
                </TableRow>
              )}

              {!isLoadingUsers && (
                <>
                  {!!table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableDetail key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableDetail>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableDetail
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableDetail>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardUsersPage;
