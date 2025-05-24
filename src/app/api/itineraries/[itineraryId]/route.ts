import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { ItineraryProps } from '@/types/itinerary';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/react-native';

export async function GET(request: Request, { params }: ItineraryProps) {
    const { itineraryId: id } = await params;

    try {
        const itinerary = await prisma.itinerary.findUnique({
            where: { id },
            include: {
                dayPlans: {
                  orderBy: {
                      date: 'asc',
                  }
                },
            },
        });

        if (!itinerary) {
            return NextResponse.json({ message: 'Itinerary not found' }, { status: 404 });
        }

        return NextResponse.json(itinerary, { status: 200 });
    } catch (error) {
        console.error('Error fetching itinerary:', error);
        return NextResponse.json({ message: 'Failed to fetch itinerary' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: ItineraryProps) {
    const { itineraryId: id } = await params;
    const { name, startDate, endDate, description } = await request.json();

    try {
        const updatedItinerary = await prisma.itinerary.update({
            where: { id },
            data: {
                name,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : undefined,
                description,
            },
            include: {
                dayPlans: {
                  orderBy: {
                      date: 'asc',
                  }
                },
            },
        });

        return NextResponse.json(updatedItinerary, { status: 200 });
    } catch (error) {
        console.error('Error updating itinerary', error);
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ message: 'Itinerary not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Failed to update itinerary' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: ItineraryProps) {
    const { itineraryId: id } = await params;

    try {
        await prisma.itinerary.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting itinerary:', error);
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ message: 'Itinerary not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Failed to delete itinerary' }, { status: 500 });
    }
}
