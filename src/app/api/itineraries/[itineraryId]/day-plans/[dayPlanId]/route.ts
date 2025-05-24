import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import type { DayPlanProps } from '@/types/dayplan';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/react-native';

export async function PUT(request: Request, { params }: DayPlanProps) {
    const { itineraryId, dayPlanId } = await params;
    const { title, description, date } = await request.json();

    try {
        const updatedDayPlan = await prisma.dayPlan.update({
            where: {
              id: dayPlanId,
              itineraryId: itineraryId,
            },
            data: {
                title,
                description,
                date: date ? new Date(date) : undefined,
            },
        });

        return NextResponse.json(updatedDayPlan, { status: 200 });
    } catch (error) {
        console.error('Error updating dayplan', error);
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            return NextResponse.json({ message: 'Dayplan not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Failed to update dayplan' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: DayPlanProps) {
    const { itineraryId, dayPlanId } = await params;

    try {
        await prisma.dayPlan.delete({
          where: {
            id: dayPlanId,
            itineraryId: itineraryId,
          },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error('Error deleting dayplan:', error);
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
          return NextResponse.json({ message: 'Dayplan not found' }, { status: 404 });
      }
      return NextResponse.json({ message: 'Failed to delete dayplan' }, { status: 500 });
    }
}
