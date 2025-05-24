import Link from 'next/link';
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Hello, welcome to Trip Planner!
      </h1>
      <Button asChild>
        <Link href="/itineraries">
          Manage trips
        </Link>
      </Button>
    </div>
  );
}
