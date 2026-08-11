import Link from "next/link";
import { Calendar, MapPin, Users, Car as CarIcon, ArrowRight, Plus } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import getTrips from "@/features/trips/actions/getTrips";

// Dummy Data for UI preview
const TRIPS = [
  {
    id: "1",
    title: "Выходные в горах",
    destination: "Брашов",
    date: "12 Октября 2026",
    status: "CONFIRMED",
    carsCount: 3,
    participantsCount: 12,
  },
  {
    id: "2",
    title: "Поездка на концерт",
    destination: "Бухарест",
    date: "25 Октября 2026",
    status: "PLANNING",
    carsCount: 1,
    participantsCount: 4,
  },
  {
    id: "3",
    title: "Летний отдых",
    destination: "Констанца",
    date: "15 Августа 2026",
    status: "COMPLETED",
    carsCount: 4,
    participantsCount: 18,
  }
];

export default async function DashboardPage() {

  const { data: trips, error } = await getTrips();

  if (error) return <div>Ошибка: {error}</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Мои поездки</h1>
          <p className="text-muted-foreground mt-1">Управляйте еженедельными выездами</p>
        </div>
        <Button asChild className="hidden sm:flex shadow-lg shadow-primary/20">
          <Link href="/trips/new">
            <Plus className="w-4 h-4 mr-2" />
            Создать
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!trips?.length ? <div>Нет поездок</div> :
          trips.map((trip) => (
            <Card key={trip.id} className="flex flex-col hover:border-primary/50 transition-colors group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {trip.title}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5 mr-1" />
                      {trip.destination}
                    </div>
                  </div>
                  <Badge variant={trip.status === "CONFIRMED" ? "success" : trip.status === "PLANNING" ? "default" : "secondary"}>
                    {trip.status === "CONFIRMED" ? "Подтверждена" : trip.status === "PLANNING" ? "Планируется" : "Завершена"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex items-center text-sm mb-4 bg-secondary/50 rounded-lg p-2 w-fit">
                  <Calendar className="w-4 h-4 mr-2 text-primary" />
                  <span className="font-medium">{trip.date.toLocaleDateString('ru-RU')}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CarIcon className="w-4 h-4 mr-1.5" />
                    {trip._count.cars}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1.5" />
                    {trip._count.participants}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 mt-auto">
                <Button asChild variant="secondary" className="w-full justify-between group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <Link href={`/trips/${trip.id}`}>
                    Управление
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  );
}
