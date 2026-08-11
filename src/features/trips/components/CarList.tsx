"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CarCard } from "./CarCard";
import { AddCarModal } from "./AddCarModal";
import { CarWithRelations, Participant } from "../types";

export function CarList({ cars, allParticipants, unassigned, tripId, isReadOnly = false }: { cars: CarWithRelations[], allParticipants: Participant[], unassigned: Participant[], tripId: string, isReadOnly?: boolean }) {
  const [isAddCarOpen, setIsAddCarOpen] = React.useState(false);

  return (
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center">
              Машины
            </h3>
            {!isReadOnly && (
              <Button size="sm" variant="outline" onClick={() => setIsAddCarOpen(true)} className="cursor-pointer">
                <Plus className="w-4 h-4 mr-1" />
                Добавить машину
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cars.map((car: CarWithRelations) => (
              <CarCard key={car.id} car={car} unassigned={unassigned} tripId={tripId} isReadOnly={isReadOnly} />
            ))}
          </div>

          {!isReadOnly && (
            <AddCarModal 
              isOpen={isAddCarOpen} 
              onClose={() => setIsAddCarOpen(false)} 
              allParticipants={allParticipants} 
              tripId={tripId}
            />
          )}
        </div>
  );
}
