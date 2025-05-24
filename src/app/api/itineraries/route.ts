import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseISO, addDays, differenceInDays } from 'date-fns';

export async function GET() {
    try {
        const itineraries = await prisma.itinerary.findMany({
            orderBy: {
                startDate: 'asc',
            }
        })

        return NextResponse.json(itineraries, { status: 200 });
    } catch (error) {
        console.error('Error fetching itineraries:', error);
        return NextResponse.json({ message: 'Failed to fetch itineraries' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, startDate, endDate, description } = await request.json();

        if (!name || !startDate || !endDate) {
            return NextResponse.json({ message: 'Field \'name\', \'startDate\', and \'endDate\' are required' }, { status: 400 })
        }

        const parsedStartDate = parseISO(startDate);
        const parsedEndDate = parseISO(endDate);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return NextResponse.json({ message: 'Invalid date format provided.' }, { status: 400 });
        }

        if (parsedStartDate > parsedEndDate) {
            return NextResponse.json({ message: 'End date cannot be before start date.' }, { status: 400 });
        }

        const numberOfDays = differenceInDays(parsedEndDate, parsedStartDate) + 1;
        const dayPlansToCreate = [];

        for (let i = 0; i < numberOfDays; i++) {
          const dayPlanDate = addDays(parsedStartDate, i);

          dayPlansToCreate.push({
            date: dayPlanDate, // This will correctly be a Date object
            title: `Day Plan ${i + 1}: ${i === 0 ? 'Arrival' : i === numberOfDays - 1 ? 'Departure' : 'Explore'}`,
          });
        }

        const newItinerary = await prisma.itinerary.create({
          data: {
            name,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            description,
            dayPlans: {
              create: dayPlansToCreate,
            },
          },
          include: {
              dayPlans: {
                orderBy: {
                    date: 'asc',
                }
              },
          },
        });

        return NextResponse.json(newItinerary, { status: 201 });
    } catch (error) {
        console.error('Error creating itinerary:', error);
        return NextResponse.json({ message: 'Failed to create itinerary' }, { status: 500 })
    }
}
