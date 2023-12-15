import { BellIcon } from "lucide-react";
import Button from "../Button";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "~/trpc/react";
import Avatar from "../Avatar";
import AnnouncementPriorityBadge from "./AnnouncementPriorityBadge";

const RequestAnnouncementDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: announcemets } = api.announcement.getPendingRequest.useQuery();

  return (
    <div className="relative">
      <Button
        className="relative flex rounded-full p-3"
        onClick={() => setShowDropdown((s) => !s)}
      >
        <BellIcon strokeWidth={1.2} />
        {announcemets && !!announcemets.length && (
          <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {announcemets.length}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 z-10 mt-2 flex-col gap-2 rounded-xl border bg-white p-4 transition-all"
            onMouseLeave={() => setShowDropdown(false)}
          >
            <div className="flex w-[300px] flex-col gap-2">
              {announcemets?.map((announcement) => (
                <div
                  className="cursor-pointer rounded-md p-2 transition-all hover:bg-slate-100"
                  onClick={() =>
                    (window.location.href = `/editor/preview/${announcement.id}`)
                  }
                >
                  <div className="flex justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Avatar
                        alt="User Profile Picture"
                        className="h-8 w-8"
                        src={announcement.author.image}
                      />

                      <span>{announcement.author.username}</span>
                    </div>
                    <AnnouncementPriorityBadge
                      priority={announcement.priority}
                      className="flex items-center justify-center p-1 px-3 text-xs"
                    />
                  </div>

                  <div className="mt-2 line-clamp-1 font-semibold text-[#3F3F3F]">
                    {announcement.title}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RequestAnnouncementDropdown;
