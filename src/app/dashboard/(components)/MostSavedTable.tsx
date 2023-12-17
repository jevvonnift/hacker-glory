import Link from "next/link";
import type { HTMLAttributes } from "react";
import Avatar from "~/components/Avatar";
import {
  Table,
  TableBody,
  TableDetail,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/Table";
import { cn } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/shared";

interface Props extends HTMLAttributes<HTMLDivElement> {
  savedAnnouncements: RouterOutputs["statistic"]["getMostSaved"];
}

const MostSavedTable = ({ savedAnnouncements, className, ...props }: Props) => {
  return (
    <div className={cn("rounded-xl bg-white", className)} {...props}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-[200px]">Judul</TableHead>
            <TableHead>Penulis</TableHead>
            <TableHead>Total Penyimpan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {savedAnnouncements.map((announcement) => (
            <TableRow key={`visited-${announcement.id}`}>
              <TableDetail className="max-w-[200px]">
                <Link
                  href={`/announcement/${announcement.id}`}
                  className="hover:text-blue-500"
                >
                  <p className="line-clamp-1">{announcement.title}</p>
                </Link>
              </TableDetail>
              <TableDetail className="flex items-center gap-2">
                <Avatar
                  alt={announcement.author.username}
                  src={announcement.author.image}
                  className="h-6 w-6"
                />
                <span>{announcement.author.username}</span>
              </TableDetail>
              <TableDetail>{announcement._count.savedBy}</TableDetail>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MostSavedTable;
