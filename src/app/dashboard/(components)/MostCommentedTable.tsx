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
  commentedAnnouncements: RouterOutputs["statistic"]["getMostCommented"];
}

const MostComentedTable = ({
  commentedAnnouncements,
  className,
  ...props
}: Props) => {
  return (
    <div
      className={cn("w-full overflow-auto rounded-xl bg-white", className)}
      {...props}
    >
      <Table className="table-auto">
        <TableHeader>
          <TableRow>
            <TableHead className="max-w-[200px]">Judul</TableHead>
            <TableHead>Penulis</TableHead>
            <TableHead>Total Komentar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {commentedAnnouncements.map((announcement) => (
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
              <TableDetail>{announcement._count.comments}</TableDetail>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MostComentedTable;
