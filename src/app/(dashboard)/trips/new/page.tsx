"use client";

import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { useActionState } from "react";
import createTrip from "@/features/trips/actions/createTrip";

export default function NewTripPage() {

  const [state, formAction, isPending] = useActionState(createTrip, null)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" asChild className="rounded-full">
          <Link href="/">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Новая поездка</h1>
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
                Название (например: "Выходные в горах")
              </label>
              <Input id="title" name="title" placeholder="Введите название..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="destination">
                  Куда едем?
                </label>
                <Input id="destination" name="destination" placeholder="Брашов" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="date">
                  Дата
                </label>
                <Input id="date" name="date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="notes">
                Заметки (опционально)
              </label>
              <textarea
                id="notes"
                className="flex min-h-[100px] w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors backdrop-blur-sm resize-none"
                placeholder="Детали поездки, место сбора..."
                name="notes"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t border-white/5 pt-6">
            <div className="text-sm font-medium text-red-500">
              {state?.error}
            </div>
            <Button disabled={isPending} className="shadow-lg shadow-primary/20">
              <Save className="w-4 h-4 mr-2" />
              {isPending ? "Сохранение..." : "Сохранить поездку"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
