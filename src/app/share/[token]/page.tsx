import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { TripBoard } from "@/features/trips/components/TripBoard";

export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  // 1. Попытка автоматического добавления partnerId
  try {
    await prisma.$executeRawUnsafe(`ALTER TABLE "Participant" ADD COLUMN IF NOT EXISTS "partnerId" TEXT;`);
  } catch {
    // ignore
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let trip: any = null;

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
      const baseParticipantFields = {
        id: true,
        name: true,
        phone: true,
        tripId: true,
        carId: true,
        createdAt: true,
      };

      const fallbackTrip = await prisma.trip.findUnique({
        where: { shareToken: token },
        include: {
          participants: {
            select: baseParticipantFields,
          },
          cars: {
            include: {
              driver: {
                select: baseParticipantFields,
              },
              passengers: {
                select: baseParticipantFields,
              },
            },
          },
        },
      });

      if (fallbackTrip) {
        trip = {
          ...fallbackTrip,
          participants: (fallbackTrip.participants || []).map((p) => ({
            ...p,
            partnerId: null,
            partner: null,
          })),
          cars: (fallbackTrip.cars || []).map((c) => ({
            ...c,
            driver: c.driver ? { ...c.driver, partnerId: null, partner: null } : null,
            passengers: (c.passengers || []).map((p) => ({
              ...p,
              partnerId: null,
              partner: null,
            })),
          })),
        };
      }
    } catch (fallbackError) {
      console.error("Ошибка fallback share trip:", fallbackError);
    }
  }

  if (!trip) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4 sm:p-6 min-h-screen">
      <TripBoard trip={trip} isReadOnly={true} />
    </main>
  );
}
