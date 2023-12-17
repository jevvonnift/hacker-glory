"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import AnnouncementCard from "~/components/announcement/AnnouncementCard";
import { api } from "~/trpc/react";

const DashboardAnnouncementsPage = () => {
  const {
    data: announcements,
    isLoading,
    isInitialLoading,
  } = api.announcement.getAll.useQuery({});

  return (
    <div>
      <h1 className="text-3xl font-semibold">Semua Pengumuman Terunggah</h1>

      <div className="mt-4">
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
              className="mt-4 w-full columns-1 content-center space-y-4 md:columns-1 lg:columns-2 xl:columns-3"
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
    </div>
  );
};

export default DashboardAnnouncementsPage;
