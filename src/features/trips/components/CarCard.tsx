"use client";

import * as React from "react";
import { Car, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import removeCar from "@/features/cars/actions/removeCar";
import assignParticipant from "@/features/participants/actions/assignParticipant";
import { useDroppable } from "@dnd-kit/core";
import { DraggableParticipant } from "./DraggableParticipant";
import { toast } from "sonner";
import { CarWithRelations, Participant } from "../types";

import { AssignParticipantModal } from "./AssignParticipantModal";
export function CarCard({ car, unassigned, tripId, isReadOnly = false }: { car: CarWithRelations, unassigned?: Participant[], tripId?: string, isReadOnly?: boolean }) {
  const [isAssignModalOpen, setIsAssignModalOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const { isOver, setNodeRef } = useDroppable({
    id: car.id,
    disabled: isReadOnly,
  });

  const handleRemoveCar = () => {
    if (!confirm("Удалить машину? Пассажиры автоматически станут 'Не распределены'.")) return;
    startTransition(async () => {
      const result = await removeCar(car.id, car.tripId);
      if (result?.error) toast.error(result.error);
      else toast.success("Машина удалена");
    });
  };

  const handleUnassign = (participantId: string) => {
    if (!tripId) return;
    startTransition(async () => {
      const result = await assignParticipant(participantId, null, tripId);
      if (result?.error) toast.error(result.error);
      else toast.success("Пассажир высажен");
    });
  };

  return (
            <React.Fragment>
              <Card 
                ref={setNodeRef}
                className={`border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all relative group/car ${isOver ? 'ring-2 ring-primary bg-primary/5' : ''}`}
              >
                <CardHeader className="p-4 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base flex items-center">
                        <Car className="w-4 h-4 mr-2 text-primary" />
                        {car.driver?.name}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">{car.carModel || "Авто"}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge variant="outline" className="text-xs bg-background/50">
                        {(car.passengers?.length || 0) + 1} / {car.totalSeats} мест
                      </Badge>
                      {!isReadOnly && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-6 h-6 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50 cursor-pointer"
                          onClick={handleRemoveCar}
                          disabled={isPending}
                          title="Удалить машину"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2">
                  {/* Driver slot (fixed) */}
                  <div className="flex items-center p-2 rounded-lg bg-primary/10 border border-primary/20 cursor-default transition-colors">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-2 text-[10px] text-primary font-medium">В</div>
                    <span className="font-medium text-sm text-primary">{car.driver?.name}</span>
                  </div>

                  {/* Passenger slots */}
                  {Array.from({ length: car.totalSeats - 1 }).map((_, i) => {
                    const passenger = car.passengers?.[i];
                    return passenger ? (
                      <DraggableParticipant 
                        key={passenger.id} 
                        participant={passenger}
                        index={i}
                        isReadOnly={isReadOnly}
                        onUnassign={handleUnassign}
                        isPending={isPending}
                      />
                    ) : (
                      <button 
                        key={`empty-${i}`} 
                        className={`w-full flex items-center p-2 rounded-lg bg-secondary/10 border border-dashed border-border/50 text-muted-foreground text-sm transition-all duration-200 group/slot ${!isReadOnly ? 'cursor-pointer hover:bg-primary/5 hover:border-primary/30 hover:text-primary hover:shadow-sm' : 'cursor-default'}`}
                        onClick={() => !isReadOnly && setIsAssignModalOpen(true)}
                        disabled={isReadOnly || isPending}
                      >
                        <div className="w-6 h-6 rounded-full bg-secondary/40 flex items-center justify-center mr-2 text-[10px] font-medium group-hover/slot:bg-primary/10 group-hover/slot:text-primary transition-colors">{i + 1}</div>
                        <span className="font-medium">Свободное место</span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
              {!isReadOnly && tripId && unassigned && (
                <AssignParticipantModal 
                  isOpen={isAssignModalOpen}
                  onClose={() => setIsAssignModalOpen(false)}
                  unassigned={unassigned}
                  tripId={tripId}
                  carId={car.id}
                />
              )}
            </React.Fragment>
  );
}
