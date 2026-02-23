import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const artists = await Promise.all(
    Array.from({ length: 5 }).map(() =>
      prisma.artist.create({
        data: {
          name: faker.person.fullName(),
          biography: faker.lorem.paragraph(),
          birthYear: faker.number.int({ min: 1850, max: 2000 }),
          deathYear: faker.datatype.boolean()
            ? faker.number.int({ min: 1950, max: 2025 })
            : null,
          imageUrl: faker.image.urlPicsumPhotos({ width: 800, height: 800 }),
        },
      })
    )
  );

  const collections = await Promise.all(
    Array.from({ length: 3 }).map(() =>
      prisma.collection.create({
        data: {
          title: faker.word.words({ count: { min: 1, max: 3 } }), // name -> title
          description: faker.lorem.sentence(), // obligatoire
        },
      })
    )
  );

  await Promise.all(
    Array.from({ length: 20 }).map(() => {
      const artist = faker.helpers.arrayElement(artists);
      const collection = faker.helpers.arrayElement(collections);

      return prisma.artwork.create({
        data: {
          title: faker.commerce.productName(),
          description: faker.lorem.sentences(2),
          imageUrl: faker.image.urlPicsumPhotos({ width: 1200, height: 900 }),
          creationYear: faker.number.int({ min: 1800, max: 2026 }),
          artistId: artist.id,
          collectionId: collection.id,
        },
      });
    })
  );

  console.log("✅ Seed terminé");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });