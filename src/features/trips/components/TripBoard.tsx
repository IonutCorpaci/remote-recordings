"use client";

import * as React from "react";
import { TripHeader } from "./TripHeader";
import { TripStats } from "./TripStats";
import { UnassignedList } from "./UnassignedList";
import { CarList } from "./CarList";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { ParticipantDragOverlay } from "./DraggableParticipant";
import { AllParticipantsModal } from "./AllParticipantsModal";
import { PairModal } from "@/features/participants/components/PairModal";
import { QuickMoveModal } from "./QuickMoveModal";
import assignParticipant from "@/features/participants/actions/assignParticipant";
import { toast } from "sonner";
import { TripWithRelations, CarWithRelations, Participant } from "../types";

export function TripBoard({
  trip,
  isReadOnly = false,
}: {
  trip: TripWithRelations;
  isReadOnly?: boolean;
}) {
  const [, startTransition] = React.useTransition();
  const [activeParticipant, setActiveParticipant] = React.useState<Participant | null>(null);

  // Modals state
  const [isAllParticipantsModalOpen, setIsAllParticipantsModalOpen] = React.useState(false);
  const [pairParticipantTarget, setPairParticipantTarget] = React.useState<Participant | null>(null);
  const [quickMoveParticipantTarget, setQuickMoveParticipantTarget] = React.useState<Participant | null>(null);

  const [optimisticTrip, setOptimisticTrip] = React.useOptimistic(
    trip,
    (currentTrip, action: { participantId: string; targetCarId: string | null }) => {
      const { participantId, targetCarId } = action;

      const movingParticipant = currentTrip.participants?.find((p) => p.id === participantId);

      const updatedParticipants = (currentTrip.participants || []).map((p) =>
        p.id === participantId ? { ...p, carId: targetCarId } : p
      );

      const updatedCars = (currentTrip.cars || []).map((car) => {
        const filteredPassengers = (car.passengers || []).filter((p) => p.id !== participantId);

        if (car.id === targetCarId && movingParticipant) {
          return {
            ...car,
            passengers: [...filteredPassengers, { ...movingParticipant, carId: targetCarId }],
          };
        }

        return {
          ...car,
          passengers: filteredPassengers,
        };
      });

      return {
        ...currentTrip,
        participants: updatedParticipants,
        cars: updatedCars,
      };
    }
  );

  // Вычисляем данные из оптимистичного состояния
  const cars = optimisticTrip.cars || [];
  const driverIds = new Set(cars.map((c: CarWithRelations) => c.driverId));
  const unassigned = (optimisticTrip.participants || []).filter(
    (p: Participant) => !p.carId && !driverIds.has(p.id)
  );
  const allParticipants = optimisticTrip.participants || [];

  const emptySeatsCount = cars.reduce(
    (acc: number, c: CarWithRelations) =>
      acc + (c.totalSeats - 1 - (c.passengers?.length || 0)),
    0
  );

  // Сенсоры: мышь для ПК, тач с 200мс задержкой для мобилок (чтобы не ломать скролл страницы)
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 6,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (isReadOnly) return;
    const participant = allParticipants.find((p: Participant) => p.id === event.active.id);
    if (participant) {
      setActiveParticipant(participant);
    }
  };

  const handleDragCancel = () => {
    setActiveParticipant(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveParticipant(null);
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
      setOptimisticTrip({ participantId, targetCarId });
      const result = await assignParticipant(participantId, targetCarId, trip.id);
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

  const BoardContent = (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <TripHeader trip={optimisticTrip} isReadOnly={isReadOnly} />
      <TripStats
        trip={optimisticTrip}
        cars={cars}
        unassigned={unassigned}
        emptySeatsCount={emptySeatsCount}
        onOpenAllParticipants={() => setIsAllParticipantsModalOpen(true)}
      />

      {/* Board Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <UnassignedList
          unassigned={unassigned}
          tripId={trip.id}
          isReadOnly={isReadOnly}
          onOpenPairModal={(p) => setPairParticipantTarget(p)}
          onOpenQuickMoveModal={(p) => setQuickMoveParticipantTarget(p)}
        />
        <CarList
          cars={cars}
          allParticipants={allParticipants}
          unassigned={unassigned}
          tripId={trip.id}
          isReadOnly={isReadOnly}
          onOpenPairModal={(p) => setPairParticipantTarget(p)}
          onOpenQuickMoveModal={(p) => setQuickMoveParticipantTarget(p)}
        />
      </div>

      {/* Modals */}
      <AllParticipantsModal
        isOpen={isAllParticipantsModalOpen}
        onClose={() => setIsAllParticipantsModalOpen(false)}
        allParticipants={allParticipants}
        cars={cars}
        tripId={trip.id}
        isReadOnly={isReadOnly}
        onOpenPairModal={(p) => {
          setIsAllParticipantsModalOpen(false);
          setPairParticipantTarget(p);
        }}
        onOpenQuickMoveModal={(p) => {
          setIsAllParticipantsModalOpen(false);
          setQuickMoveParticipantTarget(p);
        }}
      />

      <PairModal
        isOpen={Boolean(pairParticipantTarget)}
        onClose={() => setPairParticipantTarget(null)}
        participant={pairParticipantTarget}
        allParticipants={allParticipants}
        cars={cars}
        tripId={trip.id}
      />

      <QuickMoveModal
        isOpen={Boolean(quickMoveParticipantTarget)}
        onClose={() => setQuickMoveParticipantTarget(null)}
        participant={quickMoveParticipantTarget}
        cars={cars}
        tripId={trip.id}
      />
    </div>
  );

  if (isReadOnly) {
    return BoardContent;
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {BoardContent}
      <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
        {activeParticipant ? (
          <ParticipantDragOverlay participant={activeParticipant} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
