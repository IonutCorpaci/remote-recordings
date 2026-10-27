import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { TripBoard } from "@/features/trips/components/TripBoard";

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  let trip = null;
  try {
    trip = await prisma.trip.findUnique({
      where: { shareToken: token },
      include: {
        participants: {
          include: {
            partner: true,
          },
        },
        cars: {
          include: {
            driver: {
              include: {
                partner: true,
              },
            },
            passengers: {
              include: {
                partner: true,
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Ошибка при получении share trip со связями:", error);
    try {
      trip = await prisma.trip.findUnique({
        where: { shareToken: token },
        include: {
          participants: true,
          cars: {
            include: {
              driver: true,
              passengers: true,
            },
          },
        },
      });
    } catch (fallbackError) {
      console.error("Ошибка fallback share trip:", fallbackError);
    }
  }

  if (!trip) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 min-h-screen">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <TripBoard trip={trip as any} isReadOnly={true} />
    </main>
  );
}
