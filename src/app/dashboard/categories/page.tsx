"use client";

import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Button from "~/components/Button";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableDetail,
} from "~/components/Table";
import { api } from "~/trpc/react";

const CategoriesPage = () => {
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = api.category.getCategories.useQuery();
  const { mutate: deleteCategory } = api.category.delete.useMutation();
  const [isLoading, setisLoading] = useState(false);

  const handleDelete = (id: number) => {
    setisLoading(true);
    deleteCategory(
      {
        id,
      },
      {
        async onSuccess() {
          toast.success("Kategori berhasil dihapus");
          await refetchCategories();
          setisLoading(false);
        },
        onError() {
          toast.error("Kategori gagal dihapus");
          setisLoading(false);
        },
      },
    );
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold">Kategori</h1>
          <Button className="flex items-center gap-2">
            <PlusIcon strokeWidth={1.2} />
            <span>Tambah Kategori</span>
          </Button>
        </div>

        <div className="mt-4 w-full overflow-x-auto rounded-xl bg-white p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <span>Nama Kategori</span>
                </TableHead>
                {categories && categories.length > 0 && (
                  <TableHead>
                    <span>Aksi</span>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableDetail>{category.name}</TableDetail>
                  <TableDetail className="flex gap-2">
                    <Button
                      className="p-2 text-red-500"
                      onClick={() => handleDelete(category.id)}
                      disabled={isLoading}
                    >
                      <TrashIcon strokeWidth={1.2} size={20} />
                    </Button>
                    <Button className="p-2 text-blue-500" disabled={isLoading}>
                      <EditIcon strokeWidth={1.2} size={20} />
                    </Button>
                  </TableDetail>
                </TableRow>
              ))}
              {isLoadingCategories && (
                <TableRow>
                  <TableDetail>Loading Data Kategori...</TableDetail>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
