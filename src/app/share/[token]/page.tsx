import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { TripBoard } from "@/features/trips/components/TripBoard";

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const trip = await prisma.trip.findUnique({
    where: { shareToken: token },
    include: {
      participants: true,
      cars: {
        include: {
          driver: true,
          passengers: true
        }
      }
    }
  });

  if (!trip) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 min-h-screen">
      <TripBoard trip={trip} isReadOnly={true} />
    </main>
  );
}
