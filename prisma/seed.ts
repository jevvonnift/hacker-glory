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
      username: "admin123",
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

  /**
   * Seeding siswa account
   */
  await db.user.create({
    data: {
      username: "siswa123",
      email: "siswa@gmail.com",
      password: "$2b$10$A5nSCfpjdzdUbC2uXm1P6ej0MhWIsGh95KIwY7rObyM3e3N5u2Ouu",
      roleId: 2,
      identityId: "11111112",
      identityType: "NIP",
      image: "/img/default-user.png",
      createdAt: new Date(),
    },
  });

  /**
   * Seeding osis account
   */
  await db.user.create({
    data: {
      username: "osis123",
      email: "osis@gmail.com",
      password: "$2b$10$A5nSCfpjdzdUbC2uXm1P6ej0MhWIsGh95KIwY7rObyM3e3N5u2Ouu",
      roleId: 3,
      identityId: "11111113",
      identityType: "NIP",
      image: "/img/default-user.png",
      createdAt: new Date(),
    },
  });

  /**
   * Seeding guru account
   */
  await db.user.create({
    data: {
      username: "guru123",
      email: "guru@gmail.com",
      password: "$2b$10$A5nSCfpjdzdUbC2uXm1P6ej0MhWIsGh95KIwY7rObyM3e3N5u2Ouu",
      roleId: 4,
      identityId: "11111113",
      identityType: "NIP",
      image: "/img/default-user.png",
      createdAt: new Date(),
    },
  });

  /**
   * Seeding ketegori
   */
  await db.category.createMany({
    data: [
      {
        name: "Umum",
      },
      {
        name: "Libur",
      },
      {
        name: "Jadwal",
      },
      {
        name: "Ulangan",
      },
      {
        name: "Hasil Karya",
      },
      {
        name: "Eksul",
      },
      {
        name: "Event",
      },
    ],
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
