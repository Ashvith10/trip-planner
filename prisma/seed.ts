import { PrismaClient, Prisma } from "../generated/prisma";

const prisma = new PrismaClient();

const itineraryData: Prisma.ItineraryCreateInput[] = [
  {
    name: 'Summer European Adventure',
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-07-15'),
    description: 'A fantastic two-week journey through the heart of Europe, visiting iconic cities.',
  },
  {
    name: 'Coastal Road Trip: California',
    startDate: new Date('2024-08-10'),
    endDate: new Date('2024-08-17'),
    description: 'An epic road trip along the scenic California coast, from San Francisco to Los Angeles.',
  },
  {
    name: 'Mountain Retreat: Colorado',
    startDate: new Date('2024-09-05'),
    endDate: new Date('2024-09-09'),
    description: 'A peaceful escape to the Rocky Mountains for hiking and relaxation.',
  },
];

export async function main() {
  for (const i of itineraryData) {
    await prisma.itinerary.create({ data: i });
  }
}

main();
