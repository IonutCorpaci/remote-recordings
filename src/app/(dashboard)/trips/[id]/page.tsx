import getTrip from "@/features/trips/actions/getTrip";
import { TripBoard } from "@/features/trips/components/TripBoard";

export default async function TripDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: trip, error } = await getTrip(id);

  if (error) return <div>Ошибка: {error}</div>
  if (!trip) {
    return <div>Ошибка: {error}</div>
  }

  return <TripBoard trip={trip} />;
}
