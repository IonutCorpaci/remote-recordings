"use client";

import * as React from "react";
import { TripHeader } from "./TripHeader";
import { TripStats } from "./TripStats";
import { UnassignedList } from "./UnassignedList";
import { CarList } from "./CarList";
import { DndContext, DragEndEvent, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import assignParticipant from "@/features/participants/actions/assignParticipant";
import { toast } from "sonner";
import { TripWithRelations, CarWithRelations, Participant } from "../types";

export function TripBoard({ trip, isReadOnly = false }: { trip: TripWithRelations, isReadOnly?: boolean }) {
  const [isPending, startTransition] = React.useTransition();

  // Вычисляем данные из БД
  const cars = trip.cars || [];
  const driverIds = new Set(cars.map((c: CarWithRelations) => c.driverId));
  const unassigned = (trip.participants || []).filter((p: Participant) => !p.carId && !driverIds.has(p.id));
  const allParticipants = trip.participants || [];

  const emptySeatsCount = cars.reduce((acc: number, c: CarWithRelations) => acc + (c.totalSeats - 1 - (c.passengers?.length || 0)), 0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (isReadOnly) return;
    const { active, over } = event;
    if (!over) return;

    const participantId = active.id as string;
    const dropZoneId = over.id as string;

    const participant = allParticipants.find((p: Participant) => p.id === participantId);
    if (!participant) return;

    let targetCarId: string | null = null;
    
    if (dropZoneId === "unassigned") {
      targetCarId = null;
    } else {
      targetCarId = dropZoneId;
    }

    if (participant.carId === targetCarId) return;
    
    if (targetCarId) {
      const targetCar = cars.find((c: CarWithRelations) => c.id === targetCarId);
      if (targetCar) {
         const passengerCapacity = targetCar.totalSeats - 1;
         if (targetCar.passengers.length >= passengerCapacity) {
             toast.error("В этой машине больше нет свободных мест!");
             return;
         }
      }
    }

    startTransition(async () => {
      const result = await assignParticipant(participantId, targetCarId, trip.id);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  const BoardContent = (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <TripHeader trip={trip} isReadOnly={isReadOnly} />
      <TripStats
        trip={trip}
        cars={cars}
        unassigned={unassigned}
        emptySeatsCount={emptySeatsCount}
      />

      {/* Board Layout */}
      <div className={`grid grid-cols-1 lg:grid-cols-4 gap-6 transition-opacity ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
        <UnassignedList unassigned={unassigned} tripId={trip.id} isReadOnly={isReadOnly} />
        <CarList cars={cars} allParticipants={allParticipants} tripId={trip.id} isReadOnly={isReadOnly} />
      </div>
    </div>
  );

  if (isReadOnly) {
    return BoardContent;
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {BoardContent}
    </DndContext>
  );
}
