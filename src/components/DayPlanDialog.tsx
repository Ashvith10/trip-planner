import { ChangeEvent } from 'react';
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import type { DayPlan, DayPlanFormData } from '@/types/dayplan';
import type { Itinerary } from '@/types/itinerary';

interface DayPlanDialogProps {
  formData: DayPlanFormData;
  setFormData: React.Dispatch<React.SetStateAction<DayPlanFormData>>;
  itineraryId: string | undefined;
  setItinerary: React.Dispatch<React.SetStateAction<Itinerary | undefined>>;
}

export default function DayPlanDialog({ formData, setFormData, itineraryId, setItinerary }: DayPlanDialogProps) {
  const handleText = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = event.target;
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleCreateSubmit = async (): Promise<void> => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/day-plans`, {
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

      const newDayPlan: DayPlan = await response.json();
      setItinerary(prev => {
        if (!prev) {
          return undefined;
        }

        return {
          ...prev,
          dayPlans: [...prev.dayPlans, newDayPlan],
        };
      });
    } catch (error) {
      console.error('Error creating itinerary:', error);
    }
  }

  const handleUpdateSubmit = async (dayPlansId: string): Promise<void> => {
    try {
      const response = await fetch(`/api/itineraries/${itineraryId}/day-plans/${dayPlansId}`, {
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

      const updatedDayPlan: DayPlan = await response.json();
      setItinerary(prev => {
        if (!prev) {
          return undefined;
        }

        return {
          ...prev,
          dayPlans: prev.dayPlans.map(currentDayPlan => currentDayPlan.id === dayPlansId ? updatedDayPlan : currentDayPlan)
        };
      });
    } catch (error) {
      console.error('Error updating itinerary:', error);
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{formData.id === undefined ? 'Create' : 'Update'} itinerary</DialogTitle>
        <DialogDescription>
          { formData.id === undefined ? 'Create a new dayplan.' : 'Update current dayplan.' }
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Title
          </Label>
          <Input
            id="title"
            value={formData.title}
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
            Date
          </Label>
          <Popover modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !formData.date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={new Date(formData.date)}
                onSelect={(date) => setFormData(prev => ({ ...prev, date: date ? date.toISOString() : '' }))}
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
