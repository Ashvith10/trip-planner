import { PrismaClient, Prisma } from "../generated/prisma";
import { addDays } from 'date-fns';

const prisma = new PrismaClient();

const itineraryData: Omit<Prisma.ItineraryCreateInput, 'dayPlans'>[] = [
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
  for (const data of itineraryData) {
    const currentItineraryStartDate = data.startDate;
    const createdItinerary = await prisma.itinerary.create({
      data: {
        ...data,
        dayPlans: {
          create: [
            { date: currentItineraryStartDate, title: 'Day Plan 1: Arrival & Local Exploration' },
            { date: addDays(currentItineraryStartDate, 1), title: 'Day Plan 2: Main Activity Day' },
            { date: addDays(currentItineraryStartDate, 2), title: 'Day Plan 3: Departure & Souvenirs' },
          ],
        },
      },
    });
  }
}

main();
