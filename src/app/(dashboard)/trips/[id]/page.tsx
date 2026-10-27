import getTrip from "@/features/trips/actions/getTrip";
import { TripBoard } from "@/features/trips/components/TripBoard";
import { notFound } from "next/navigation";

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: trip, error } = await getTrip(id);

  if (error) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Ошибка загрузки поездки</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!trip) {
    notFound();
  }

  return <TripBoard trip={trip} />;
}
