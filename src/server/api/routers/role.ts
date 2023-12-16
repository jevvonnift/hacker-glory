import { adminProcedure, createTRPCRouter } from "../trpc";

export const roleRouter = createTRPCRouter({
  getAll: adminProcedure.query(({ ctx }) => {
    return ctx.db.role.findMany();
  }),
});
