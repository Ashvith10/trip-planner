export interface DayPlanProps {
  params: Promise<{
    itineraryId: string,
    dayPlanId: string,
  }>;
};

export interface DayPlan {
  id: string;
  date: string;
  title: string;
  description: string;
  itineraryId: string;
};

export type DayPlanFormData = Omit<DayPlan, 'id' | 'itineraryId'> & { id?: string };
