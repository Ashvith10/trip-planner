"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Itinerary } from '@/types/itinerary';
import type { DayPlanFormData } from '@/types/dayplan';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { MoveLeft, Pencil, Trash, Plus } from "lucide-react";
import { useParams, useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import DayPlanDialog from "@/components/DayPlanDialog";

export default function ItineraryDayPlan() {
  const router = useRouter();
  const { itineraryId } = useParams() as { itineraryId: string | undefined };
  const [itinerary, setItinerary] = useState<Itinerary | undefined>(undefined);
  const [formData, setFormData] = useState<DayPlanFormData>({
    date: "",
    title: "",
    description: "",
  });

  const getItinerary = async (itineraryId: string) => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}`);
      setItinerary(await response.json());
    } catch (error) {
      console.error('Failed to fetch itineraries:', error);
    }
  }

  useEffect(() => {
    if (typeof itineraryId === 'string') {
      getItinerary(itineraryId);
    } else {
      router.push('/404');
    }

  }, [itineraryId, router])

  const deleteDayPlan = async (dayPlanId: string) => {
    try {
      await fetch(`/api/itineraries/${itineraryId}/day-plans/${dayPlanId}`, {
        method: "DELETE"
      });
      setItinerary(prev => {
        if (!prev) {
            console.warn("Attempted to modify day plans on an undefined itinerary.");
            return undefined;
        }

        return {
            ...prev,
            dayPlans: prev.dayPlans.filter(val => val.id !== dayPlanId)
        };
      });
    } catch (error) {
      console.error('Failed to fetch itinerary:', error);
    }
  }

  return (
    itinerary &&
    <div>
      <Dialog>
        <DayPlanDialog
          formData={formData}
          setFormData={setFormData}
          itineraryId={itineraryId}
          setItinerary={setItinerary}
        />
        <Card>
          <CardHeader>
            <CardTitle>{itinerary.name}</CardTitle>
            <CardDescription>
              {new Date(itinerary.startDate).toLocaleDateString()} - {new Date(itinerary.endDate).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {itinerary.description}
            </p>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              Day plans
            </p>
            {itinerary.dayPlans.length === 0 ? (
              <p className="leading-7 [&:not(:first-child)]:mt-6">
                No plans found. Create one!
              </p>
            ) : (
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {itinerary.dayPlans.map(({ id, title, description, date }) => (
                  <Card key={id}>
                    <CardHeader>
                      <CardTitle>
                        {title}
                      </CardTitle>
                      <CardDescription>
                        {new Date(date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="leading-7 [&:not(:first-child)]:mt-6">
                        {description}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <DialogTrigger asChild onClick={() => setFormData({
                            id,
                            date,
                            title,
                            description,
                        })}
                       >
                        <Button variant="outline">
                          <Pencil /> Update
                        </Button>
                      </DialogTrigger>
                      <Button variant="destructive" onClick={() => deleteDayPlan(id)}>
                        <Trash /> Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </ul>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <DialogTrigger asChild onClick={() => setFormData({
                  date: "",
                  title: "",
                  description: "",
              })}
            >
              <Button>
                <Plus /> Create dayplan
              </Button>
            </DialogTrigger>
            <Button asChild>
              <Link href={`/itineraries`}>
                <MoveLeft /> Go back
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </Dialog>
    </div>
  );
}
