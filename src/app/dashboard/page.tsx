"use client";

import { api } from "~/trpc/react";
import MostVisitedTable from "./(components)/MostVisitedTable";
import MostSavedTable from "./(components)/MostSavedTable";
import MostCommentedTable from "./(components)/MostCommentedTable";

const DashboardPage = () => {
  const { data: mostVisited } = api.statistic.getMostVisited.useQuery();
  const { data: mostSaved } = api.statistic.getMostSaved.useQuery();
  const { data: mostCommented } = api.statistic.getMostCommented.useQuery();
  const {} = api.statistic.getVisitedInWeek.useQuery();

  return (
    <div>
      <h1 className="text-3xl font-semibold">Dashboard</h1>

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
