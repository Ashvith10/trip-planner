import { ChangeEvent } from 'react';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { Itinerary, ItineraryFormData } from '@/types/itinerary';
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"

interface ItineraryDialogProps {
  formData: ItineraryFormData;
  setFormData: React.Dispatch<React.SetStateAction<ItineraryFormData>>;
  setItineraries: React.Dispatch<React.SetStateAction<Itinerary[]>>;
}

export default function ItineraryDialog({
    formData,
    setFormData,
    setItineraries
}: ItineraryDialogProps) {
  const handleText = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleCreateSubmit = async (): Promise<void> => {
    try {
      const response = await fetch('/api/itineraries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.message);
        return;
      }

      const newItinerary: Itinerary = await response.json();
      setItineraries(prev => ([ ...prev, newItinerary ]));
    } catch (event) {
      console.error('Error creating itinerary:', event);
    }
  }

  const handleUpdateSubmit = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/itineraries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData.message);
        return;
      }

      const updatedItinerary: Itinerary = await response.json();
      setItineraries(prev => prev.map(currentItinerary => currentItinerary.id === id ? updatedItinerary : currentItinerary));
    } catch (event) {
      console.error('Error updating itinerary:', event);
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{formData.id === undefined ? 'Create' : 'Update'} itinerary</DialogTitle>
        <DialogDescription>
          { formData.id === undefined ? 'Create a new itinerary.' : 'Update current itinerary.' }
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={handleText}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Type itinerary description here."
            value={formData.description}
            onChange={handleText}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Start date
          </Label>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !formData.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.startDate)}
                onSelect={(startDate) => setFormData(prev => ({ ...prev, startDate: startDate ? startDate.toISOString() : '' }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            End date
          </Label>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !formData.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.endDate)}
                onSelect={(endDate) => setFormData(prev => ({ ...prev, endDate: endDate ? endDate.toISOString() : '' }))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button onClick={() => formData.id === undefined ? handleCreateSubmit() : handleUpdateSubmit(formData.id)}>
            { formData.id === undefined ? 'Create new' : 'Update changes' }
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
