"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import AnnouncementCard from "~/components/announcement/AnnouncementCard";
import { api } from "~/trpc/react";
import MainPageNavbar from "./(components)/Navbar";
import BottomNavbar from "./(components)/BottomNavbar";
import { useRouter, useSearchParams } from "next/navigation";

enum OrderByParamType {
  latest = "latest",
  oldest = "oldest",
}

const HomePage = () => {
  const params = useSearchParams();
  const paramOrderBy = params.get("orderBy");
  const router = useRouter();

  const orderBy = paramOrderBy
    ? paramOrderBy in OrderByParamType
      ? (paramOrderBy as OrderByParamType)
      : undefined
    : "latest";

  const {
    data: announcements,
    isLoading,
    isInitialLoading,
  } = api.announcement.getAll.useQuery({
    filter: {
      orderBy,
    },
  });

  const handleOrderByChange = (orderBy: OrderByParamType) => {
    router.replace(`/?orderBy=${orderBy}`);
  };

  return (
    <div>
      <MainPageNavbar />

      <div className="mt-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-xl font-semibold sm:text-3xl">
            Pengumuman Saat Ini
          </h1>
          <select
            onChange={(e) =>
              handleOrderByChange(e.target.value as OrderByParamType)
            }
            value={orderBy ?? "latest"}
            className="rounded-md border px-4 py-2 focus-visible:outline-none"
          >
            <option value="latest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </select>
        </motion.div>

        {isInitialLoading && (
          <div className="mt-4 flex w-full justify-center">
            <Loader2Icon className="animate-spin" size={30} />
          </div>
        )}

        {announcements && !announcements.length && !isLoading && (
          <div className="mt-4 flex w-full justify-center">
            <p className="mt-2 text-xl text-gray-500">
              Belum ada pengumuman saat ini.
            </p>
          </div>
        )}

        <AnimatePresence>
          {announcements && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              layout
              className="mt-4 w-full space-y-4 sm:columns-2 lg:columns-3"
            >
              {announcements.map((announcement, idx) => (
                <motion.div
                  layout
                  key={announcement.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3, delay: 0.1 * idx }}
                >
                  <AnnouncementCard
                    className="break-inside-avoid-column"
                    announcement={announcement}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BottomNavbar />
    </div>
  );
};

export default HomePage;
