"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { Itinerary, ItineraryFormData } from '@/types/itinerary';
import { Button } from "@/components/ui/button";
import { Plus, Eye, Pencil, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import ItineraryDialog from "@/components/ItineraryDialog";

export default function ItinerariesPage() {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [formData, setFormData] = useState<ItineraryFormData>({
    name: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  const getItineraries = async () => {
    try {
      const response = await fetch('/api/itineraries');
      setItineraries(await response.json());
    } catch (error) {
        console.error('Failed to fetch itineraries:', error);
    }
  }

  const deleteItinerary = async (id: string) => {
      try {
          await fetch(`/api/itineraries/${id}`, {
              method: "DELETE"
          });
          setItineraries(prev => prev.filter(val => val.id !== id));
      } catch (error) {
          console.error('Failed to fetch itinerary:', error);
      }
  }

  useEffect(() => {
    getItineraries()
  }, [])

  return (
    <div>
      <Dialog>
        <ItineraryDialog
          formData={formData}
          setFormData={setFormData}
          setItineraries={setItineraries}
        />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Your itineraries
        </h1>
        {itineraries.length === 0 ? (
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              No itineraries found. Create one!
            </p>
        ) : (
           <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
             {itineraries.map(({ id, name, startDate, endDate, description }) => (
               <Card key={id}>
                 <CardHeader>
                   <CardTitle>
                     {name}
                   </CardTitle>
                   <CardDescription>
                     {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                   </CardDescription>
                 </CardHeader>
                 <CardContent>
                   <p className="leading-7 [&:not(:first-child)]:mt-6">
                     {description}
                   </p>
                 </CardContent>
                 <CardFooter className="flex justify-between">
                   <Button asChild>
                     <Link href={`/itineraries/${id}`}>
                       <Eye /> View plans
                     </Link>
                   </Button>
                   <DialogTrigger asChild onClick={() => setFormData({
                       id,
                       name,
                       startDate,
                       endDate,
                       description,
                     })}
                   >
                     <Button variant="outline">
                       <Pencil /> Update
                     </Button>
                   </DialogTrigger>
                   <Button variant="destructive" onClick={() => deleteItinerary(id)}>
                     <Trash /> Delete
                   </Button>
                 </CardFooter>
               </Card>
             ))}
           </ul>
        )}
        <DialogTrigger asChild onClick={() => setFormData({
            name: "",
            startDate: "",
            endDate: "",
            description: "",
          })}
        >
          <Button>
            <Plus /> Create itinerary
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
}
