"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Loader2Icon } from "lucide-react";
import AnnouncementCard from "~/components/announcement/AnnouncementCard";
import { api } from "~/trpc/react";
import MainPageNavbar from "./(components)/Navbar";
import BottomNavbar from "./(components)/BottomNavbar";

const HomePage = () => {
  const { data: announcements, isLoading } =
    api.announcement.getAllAnnouncements.useQuery();

  return (
    <div>
      <MainPageNavbar />

      <div className="mt-4">
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center text-2xl font-semibold text-gray-600"
        >
          Pengumuman Saat Ini
        </motion.h1>

        {isLoading && (
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

      <BottomNavbar />
    </div>
  );
};

export default HomePage;
