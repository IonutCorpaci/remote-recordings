"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { useActionState, useEffect, useState } from "react";
import updateTrip from "@/features/trips/actions/updateTrip";
import { useParams, useRouter } from "next/navigation";
import { Trip } from "@/generated/prisma/client";
import { toast } from "sonner";

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);

  // Bind the id to the action
  const updateTripWithId = updateTrip.bind(null, params.id as string);
  const [state, formAction, isPending] = useActionState(updateTripWithId, null);

  useEffect(() => {
    // Fetch trip data
    fetch(`/api/trips/${params.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.trip) setTrip(data.trip);
      })
      .catch(() => toast.error("Не удалось загрузить поездку"));
  }, [params.id]);

  if (!trip) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Редактирование поездки</h1>
        </div>
      </div>

      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Основная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="title">
                Название
              </label>
              <Input id="title" name="title" defaultValue={trip.title} />
              {state?.fieldErrors?.title && (
                <p className="text-sm text-red-500 font-medium">{state.fieldErrors.title[0]}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="destination">
                  Куда едем?
                </label>
                <Input id="destination" name="destination" defaultValue={trip.destination} />
                {state?.fieldErrors?.destination && (
                  <p className="text-sm text-red-500 font-medium">{state.fieldErrors.destination[0]}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="date">
                  Дата
                </label>
                <Input id="date" name="date" type="date" defaultValue={new Date(trip.date).toISOString().split('T')[0]} />
                {state?.fieldErrors?.date && (
                  <p className="text-sm text-red-500 font-medium">{state.fieldErrors.date[0]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="notes">
                Заметки (опционально)
              </label>
              <textarea
                id="notes"
                defaultValue={trip.notes || ''}
                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors backdrop-blur-sm resize-none"
                name="notes"
              />
              {state?.fieldErrors?.notes && (
                <p className="text-sm text-red-500 font-medium">{state.fieldErrors.notes[0]}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t border-white/5 pt-6">
            <div className="text-sm font-medium text-red-500">
              {state?.error}
            </div>
            <Button disabled={isPending} className="shadow-lg shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
