"use client";

import { api } from "~/trpc/react";
import MostVisitedTable from "./(components)/MostVisitedTable";
import MostSavedTable from "./(components)/MostSavedTable";
import MostCommentedTable from "./(components)/MostCommentedTable";

import { useState } from "react";
import VisitedInWeekChart from "./(components)/VisitedInWeekChart";
import VisitedInMonthChart from "./(components)/VisitedInMonthChart";

const DashboardPage = () => {
  const { data: mostVisited } = api.statistic.getMostVisited.useQuery();
  const { data: mostSaved } = api.statistic.getMostSaved.useQuery();
  const { data: mostCommented } = api.statistic.getMostCommented.useQuery();

  const [selectedChart, setSelectedChart] = useState<"week" | "month">("week");
  const { data: visitedInThisWeek } = api.statistic.getVisitedInWeek.useQuery(
    undefined,
    {
      enabled: selectedChart === "week",
    },
  );
  const { data: visitedInThisMonth } = api.statistic.getVisitedInMonth.useQuery(
    undefined,
    {
      enabled: selectedChart === "month",
    },
  );

  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>

      <div className="mt-4 rounded-xl bg-white p-4">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-lg">
            Kunjungan {selectedChart === "week" ? "Minggu" : "Bulan"} Ini
          </h2>
          <select
            value={selectedChart}
            onChange={(e) =>
              setSelectedChart(e.target.value as "month" | "week")
            }
            className="rounded-md border px-4 py-2 focus-visible:outline-none"
          >
            <option value="week">Minggu Ini</option>
            <option value="month">Bulan Ini</option>
          </select>
        </div>

        {visitedInThisWeek && selectedChart === "week" && (
          <VisitedInWeekChart visitedData={visitedInThisWeek} />
        )}
        {visitedInThisMonth && selectedChart === "month" && (
          <VisitedInMonthChart visitedData={visitedInThisMonth} />
        )}
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {mostVisited && (
          <div>
            <h2 className="text-lg">Paling Banyak Dikunjungi</h2>
            <MostVisitedTable
              visitedAnnouncements={mostVisited}
              className="mt-2"
            />
          </div>
        )}

        {mostSaved && (
          <div>
            <h2 className="text-lg">Paling Banyak Disimpan</h2>
            <MostSavedTable savedAnnouncements={mostSaved} className="mt-2" />
          </div>
        )}

        {mostCommented && (
          <div>
            <h2 className="text-lg">Paling Banyak Dikomentar</h2>
            <MostCommentedTable
              commentedAnnouncements={mostCommented}
              className="mt-2"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
