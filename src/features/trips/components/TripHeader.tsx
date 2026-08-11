"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import deleteTrip from "@/features/trips/actions/deleteTrip";
import updateTripStatus from "@/features/trips/actions/updateTripStatus";
import { toast } from "sonner";
import { TripWithRelations } from "../types";

export function TripHeader({ trip, isReadOnly = false }: { trip: TripWithRelations, isReadOnly?: boolean }) {
  const [isPending, startTransition] = React.useTransition();

  const handleDelete = () => {
    if (!confirm("Вы уверены, что хотите удалить эту поездку?")) return;
    startTransition(async () => {
      const result = await deleteTrip(trip.id);
      if (result?.error) toast.error(result.error);
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as "PLANNING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    startTransition(async () => {
      const result = await updateTripStatus(trip.id, newStatus);
      if (result?.error) toast.error(result.error);
      else toast.success("Статус обновлен");
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/share/${trip.shareToken}`;
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Ссылка скопирована в буфер обмена");
    }).catch(() => {
      toast.error("Не удалось скопировать ссылку");
    });
  };

  return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" asChild className="rounded-full shrink-0">
            <Link href="/">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{trip.destination}</h1>
              <select 
                defaultValue={trip.status || "PLANNING"}
                onChange={handleStatusChange}
                disabled={isPending || isReadOnly}
                className="text-xs font-semibold px-2.5 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer disabled:opacity-50 appearance-none text-center"
              >
                <option value="PLANNING">В ПЛАНАХ</option>
                <option value="CONFIRMED">ПОДТВЕРЖДЕНА</option>
                <option value="COMPLETED">ЗАВЕРШЕНА</option>
                <option value="CANCELLED">ОТМЕНЕНА</option>
              </select>
            </div>
            <div className="flex items-center text-muted-foreground mt-1 text-sm">
              <MapPin className="w-4 h-4 mr-1" />
              {trip.date.toLocaleDateString('ru-RU')}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Button variant="outline" className="bg-background/50 backdrop-blur-md cursor-pointer" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Поделиться ссылкой
          </Button>
          {!isReadOnly && (
            <Button 
              variant="destructive" 
              size="icon" 
              className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 cursor-pointer transition-colors"
              onClick={handleDelete}
              disabled={isPending}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
  );
}
