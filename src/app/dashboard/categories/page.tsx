"use client";

import { EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useBoolean } from "usehooks-ts";
import Button from "~/components/Button";
import Input from "~/components/Input";
import Modal from "~/components/Modal";
import {
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  Table,
  TableDetail,
} from "~/components/Table";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

type Comment = RouterOutputs["category"]["getCategories"][number];

const CategoriesPage = () => {
  const {
    data: categories,
    isLoading: isLoadingCategories,
    refetch: refetchCategories,
  } = api.category.getCategories.useQuery();
  const { mutate: deleteCategory } = api.category.delete.useMutation();
  const { mutate: createCategory } = api.category.create.useMutation();
  const { mutate: updateCategory } = api.category.update.useMutation();
  const [isLoading, setisLoading] = useState(false);

  const [selectedRemoveCategory, setSelectedRemoveCategory] =
    useState<Comment | null>(null);
  const [selectedEditCategory, setSelectedEditCategory] =
    useState<Comment | null>(null);

  const {
    value: isCreateModalOpen,
    setTrue: openCreateModal,
    setFalse: closeCreateModal,
  } = useBoolean();
  const [newCategoryInput, setNewCategoryInput] = useState("");

  const handleDelete = (id: number) => {
    setisLoading(true);
    deleteCategory(
      {
        id,
      },
      {
        async onSuccess() {
          toast.success("Kategori berhasil dihapus");
          setSelectedRemoveCategory(null);
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

  const handleCreate = () => {
    if (newCategoryInput.length < 3)
      return toast.error("Nama kategori minimal 3 karakter");
    setisLoading(true);
    createCategory(newCategoryInput, {
      async onSuccess() {
        toast.success("Kategori berhasil dibuat");
        closeCreateModal();
        setNewCategoryInput("");
        setisLoading(false);
        await refetchCategories();
      },
      onError() {
        setisLoading(false);
        toast.error("Kategori gagal dibuat");
      },
    });
  };

  const handleUpdate = () => {
    if (!selectedEditCategory) return;
    if (selectedEditCategory.name.length < 3)
      return toast.error("Nama kategori minimal 3 karakter");
    setisLoading(true);

    updateCategory(
      {
        id: selectedEditCategory.id,
        name: selectedEditCategory.name,
      },
      {
        async onSuccess() {
          toast.success("Kategori berhasil diubah");
          setSelectedEditCategory(null);
          setisLoading(false);
          await refetchCategories();
        },
        onError() {
          toast.error("Kategori gagal diubah");
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
          <Button className="flex items-center gap-2" onClick={openCreateModal}>
            <PlusIcon strokeWidth={1.2} />
            <span>Tambah Kategori</span>
          </Button>
        </div>

        <div className="mt-4 w-full overflow-x-auto rounded-xl bg-white p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead>Total Pengumuman</TableHead>
                {categories && categories.length > 0 && (
                  <TableHead>Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableDetail>{category.name}</TableDetail>
                  <TableDetail>{category._count.announcements}</TableDetail>
                  <TableDetail className="flex gap-2">
                    <Button
                      className="p-2 text-red-500"
                      onClick={() => setSelectedRemoveCategory(category)}
                      disabled={isLoading}
                    >
                      <TrashIcon strokeWidth={1.2} size={20} />
                    </Button>
                    <Button
                      className="p-2 text-blue-500"
                      onClick={() => setSelectedEditCategory(category)}
                      disabled={isLoading}
                    >
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

      {/* Remove Modal */}
      <Modal
        isOpen={!!selectedRemoveCategory}
        onClose={() => setSelectedRemoveCategory(null)}
      >
        <h1 className="text-lg">Hapus Kategori</h1>

        {selectedRemoveCategory && (
          <>
            <p className="mt-2 text-red-500">
              Yakin ingin menghapus kategori{" "}
              <span className="font-medium">{selectedRemoveCategory.name}</span>{" "}
              dan seluruh{" "}
              <span className="font-medium">
                {selectedRemoveCategory._count.announcements}
              </span>{" "}
              pengumuman ?
            </p>

            <Button
              className="mt-4"
              onClick={() => setSelectedRemoveCategory(null)}
              disabled={isLoading}
            >
              Kembali
            </Button>
            <Button
              className="mt-2 bg-red-500 text-white hover:bg-red-600 hover:disabled:bg-red-500"
              disabled={isLoading}
              onClick={() => handleDelete(selectedRemoveCategory.id)}
            >
              Hapus
            </Button>
          </>
        )}
      </Modal>

      {/* Update Modal */}
      <Modal
        isOpen={!!selectedEditCategory}
        onClose={() => setSelectedEditCategory(null)}
      >
        <h1 className="text-lg">Ubah Kategori</h1>

        {selectedEditCategory && (
          <>
            <Input
              value={selectedEditCategory.name}
              className="mt-4 text-base"
              onChange={(e) =>
                setSelectedEditCategory((t) =>
                  t ? { ...t, name: e.target.value } : null,
                )
              }
            />
            <Button
              className="mt-4"
              onClick={closeCreateModal}
              disabled={isLoading}
            >
              Kembali
            </Button>
            <Button
              className="mt-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:disabled:bg-yellow-500"
              disabled={isLoading || selectedEditCategory.name.length === 0}
              onClick={handleUpdate}
            >
              Simpan
            </Button>
          </>
        )}
      </Modal>

      {/* Update Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={closeCreateModal}>
        <h1 className="text-lg">Tambah Kategori</h1>

        <Input
          value={newCategoryInput}
          className="mt-4 text-base"
          onChange={(e) => setNewCategoryInput(e.target.value)}
        />
        <Button
          className="mt-4"
          onClick={closeCreateModal}
          disabled={isLoading}
        >
          Kembali
        </Button>
        <Button
          className="mt-2 bg-yellow-500 text-white hover:bg-yellow-600 hover:disabled:bg-yellow-500"
          disabled={isLoading || newCategoryInput.length === 0}
          onClick={handleCreate}
        >
          Tambah
        </Button>
      </Modal>
    </>
  );
};

export default CategoriesPage;
