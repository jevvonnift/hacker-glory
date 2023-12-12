import { db } from "~/server/db";

async function main() {
  /**
   * Seeding admin role
   */
  await db.role.create({
    data: {
      name: "ADMIN",
    },
  });
  /**
   * Seeding siswa role
   */
  await db.role.create({
    data: {
      name: "SISWA",
    },
  });
  /**
   * Seeding osis role
   */
  await db.role.create({
    data: {
      name: "OSIS",
    },
  });
  /**
   * Seeding guru role
   */
  await db.role.create({
    data: {
      name: "GURU",
    },
  });

  /**
   * Seeding admin account
   */
  await db.user.create({
    data: {
      username: "admin",
      email: "admin@gmail.com",
      // admin password: "password"
      password: "$2b$10$A5nSCfpjdzdUbC2uXm1P6ej0MhWIsGh95KIwY7rObyM3e3N5u2Ouu",
      roleId: 1,
      identityId: "11111111",
      identityType: "NIP",
      image: "/img/default-user.png",
      createdAt: new Date(),
    },
  });
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
