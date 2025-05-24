import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { parseISO } from 'date-fns';
import type { ItineraryProps } from '@/types/itinerary';

export async function POST(request: Request, { params }: ItineraryProps) {
    const { itineraryId } = await params;

    try {
        const { title, description, date } = await request.json();

        if (!title || !date) {
            return NextResponse.json({ message: 'Field \'title\' and \'date\' are required' }, { status: 400 })
        }

        const parsedDate = parseISO(date);

        if (isNaN(parsedDate.getTime())) {
            return NextResponse.json({ message: 'Invalid date format provided.' }, { status: 400 });
        }

        const newDayPlan = await prisma.dayPlan.create({
          data: {
            title,
            description,
            date: new Date(date),
            itineraryId,
          },
        });

        return NextResponse.json(newDayPlan, { status: 201 });
    } catch (error) {
        console.error('Error creating dayplan:', error);
        return NextResponse.json({ message: 'Failed to create dayplan' }, { status: 500 })
    }
}
