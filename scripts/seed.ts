import { PrismaClient } from "@prisma/client";
import { PROJECTS } from "../src/constants";
import fs from "fs";
import path from "path";

const envPath = path.resolve(process.cwd(), ".env");
const envVars = fs.readFileSync(envPath, "utf-8").split("\n");
envVars.forEach((line) => {
  if (line.startsWith("DATABASE_URL=")) {
    process.env.DATABASE_URL = line.split("=")[1].trim().replace(/^"|"$/g, '');
  }
});

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding existing static projects to database...");

  for (const project of PROJECTS) {
    const existing = await prisma.project.findFirst({
      where: { title: project.name },
    });

    if (existing) {
      console.log(`Skipping: ${project.name} (already exists)`);
      continue;
    }

    await prisma.project.create({
      data: {
        title: project.name,
        description: project.description,
        imageUrl: project.image,
        liveUrl: project.link,
        githubUrl: project.github === "#" ? "" : project.github,
        techs: project.tech,
        features: project.highlights,
        featured: project.featured ?? false,
        published: true, // Mark them as published since they are live
        order: project.id, // Keep the same order
      },
    });

    console.log(`Created: ${project.name}`);
  }

  console.log("Finished seeding database!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
