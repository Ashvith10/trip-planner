import type { DayPlan } from '@/types/dayplan';

export interface ItineraryProps {
  params: Promise<{ itineraryId: string }>;
};

export interface Itinerary {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  dayPlans: DayPlan[];
};

export type ItineraryFormData = Omit<Itinerary, 'id' | 'dayPlans'> & { id?: string };
