"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import AnnouncementCard from "~/components/announcement/AnnouncementCard";
import { api } from "~/trpc/react";

const ListMyAnnouncementPage = () => {
  const { data: announcements, isLoading } =
    api.announcement.getMySavedAnnouncements.useQuery();

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center text-3xl font-semibold"
      >
        Pengumuman yang Disimpan
      </motion.h1>

      {isLoading && (
        <div className="mt-4 flex w-full justify-center">
          <Loader2Icon className="animate-spin" size={30} />
        </div>
      )}

      {announcements && !announcements.length && !isLoading && (
        <div className="mt-4 flex w-full justify-center">
          <p className="mt-2 text-xl text-gray-500">
            Kamu belum menyimpan pengumuman apapun.
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
            className="mt-4 w-full space-y-4 sm:columns-2 lg:columns-3"
          >
            {announcements.map((announcement, idx) => (
              <motion.div
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
  );
};

export default ListMyAnnouncementPage;
