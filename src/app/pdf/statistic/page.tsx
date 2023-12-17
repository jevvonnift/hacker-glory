import { api } from "~/trpc/server";
import ExportPDFStatistic from "./(components)/ExportPDFStatistic";
import { getAuthServerSession } from "~/server/auth";

const ExportPDFStatisticPage = async () => {
  const session = await getAuthServerSession();

  if (!session) return;
  if (!session.user.isAdmin) return;

  const mostVisited = await api.statistic.getMostVisited.query();
  const mostSaved = await api.statistic.getMostSaved.query();
  const mostCommented = await api.statistic.getMostCommented.query();

  const visitedInThisWeek = await api.statistic.getVisitedInWeek.query();
  const visitedInThisMonth = await api.statistic.getVisitedInMonth.query();

  return (
    <div>
      <ExportPDFStatistic
        mostVisited={mostVisited}
        mostSaved={mostSaved}
        mostCommented={mostCommented}
        visitedInThisWeek={visitedInThisWeek}
        visitedInThisMonth={visitedInThisMonth}
      />
    </div>
  );
};

export default ExportPDFStatisticPage;
