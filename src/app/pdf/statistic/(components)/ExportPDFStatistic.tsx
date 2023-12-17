"use client";

import MostVisitedTable from "../../../dashboard/(components)/MostVisitedTable";
import MostSavedTable from "../../../dashboard/(components)/MostSavedTable";
import MostCommentedTable from "../../../dashboard/(components)/MostCommentedTable";

import VisitedInWeekChart from "../../../dashboard/(components)/VisitedInWeekChart";
import VisitedInMonthChart from "../../../dashboard/(components)/VisitedInMonthChart";
import type { RouterOutputs } from "~/trpc/shared";
import Button from "~/components/Button";
import { FileTextIcon } from "lucide-react";

type Props = {
  mostVisited: RouterOutputs["statistic"]["getMostVisited"];
  mostSaved: RouterOutputs["statistic"]["getMostSaved"];
  mostCommented: RouterOutputs["statistic"]["getMostCommented"];
  visitedInThisWeek: RouterOutputs["statistic"]["getVisitedInWeek"];
  visitedInThisMonth: RouterOutputs["statistic"]["getVisitedInMonth"];
};

const ExportPDFStatistic = ({
  mostVisited,
  mostCommented,
  mostSaved,
  visitedInThisMonth,
  visitedInThisWeek,
}: Props) => {
  return (
    <div>
      <h1 className="text-center text-3xl ">Statistik Pengumuman</h1>
      <Button
        className="absolute right-2 top-2 flex items-center gap-2 px-4 print:hidden"
        onClick={() => {
          window.print();
        }}
      >
        <FileTextIcon strokeWidth={1.2} />
        <span>Export ke PDF</span>
      </Button>

      <Button
        className="absolute left-2 top-2 flex items-center gap-2 px-4 print:hidden"
        onClick={() => {
          window.location.href = "/dashboard";
        }}
      >
        <FileTextIcon strokeWidth={1.2} />
        <span>Ke Dashboard</span>
      </Button>

      <div className="mt-4 break-inside-avoid rounded-xl bg-white p-4">
        <h2 className="text-lg">Pengunjung Minggu Ini</h2>
        <VisitedInWeekChart
          disableTooltip={true}
          visitedData={visitedInThisWeek}
        />
      </div>

      <div className="mt-4 break-inside-avoid rounded-xl bg-white p-4">
        <h2 className="text-text-lg">Pengunjung Bulan Ini</h2>
        <VisitedInMonthChart
          disableTooltip={true}
          visitedData={visitedInThisMonth}
        />
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="break-inside-avoid">
          <h2 className="text-lg">Paling Banyak Dikunjungi</h2>
          <MostVisitedTable
            visitedAnnouncements={mostVisited}
            className="mt-2"
          />
        </div>

        <div className="break-inside-avoid">
          <h2 className="text-lg">Paling Banyak Disimpan</h2>
          <MostSavedTable savedAnnouncements={mostSaved} className="mt-2" />
        </div>

        <div className="break-inside-avoid">
          <h2 className="text-lg">Paling Banyak Dikomentar</h2>
          <MostCommentedTable
            commentedAnnouncements={mostCommented}
            className="mt-2"
          />
        </div>
      </div>
    </div>
  );
};

export default ExportPDFStatistic;
