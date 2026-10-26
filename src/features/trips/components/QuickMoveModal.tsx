"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Car, UserMinus, Check, AlertCircle } from "lucide-react";
import assignParticipant from "@/features/participants/actions/assignParticipant";
import { toast } from "sonner";
import { Participant, CarWithRelations } from "../types";

interface QuickMoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Participant | null;
  cars: CarWithRelations[];
  tripId: string;
}

export function QuickMoveModal({
  isOpen,
  onClose,
  participant,
  cars,
  tripId,
}: QuickMoveModalProps) {
  const [isPending, startTransition] = React.useTransition();

  if (!participant) return null;

  const currentCar = cars.find((c) =>
    (c.passengers || []).some((p) => p.id === participant.id)
  );
  const isDriver = cars.some((c) => c.driverId === participant.id);

  const handleMove = (targetCarId: string | null) => {
    startTransition(async () => {
      const result = await assignParticipant(participant.id, targetCarId, tripId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(
          targetCarId ? "Участник пересажен" : "Участник переведен в нераспределенные"
        );
        onClose();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Пересадить участника"
      description={`Выберите машину для ${participant.name}`}
    >
      <div className="space-y-3 py-2">
        {isDriver && (
          <div className="flex items-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-xs text-orange-400">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
            Этот участник является водителем машины. Чтобы переместить его, сначала назначьте другого водителя или удалите машину.
          </div>
        )}

        {!isDriver && (
          <>
            {/* Option: Unassigned */}
            <div
              onClick={() => !isPending && currentCar && handleMove(null)}
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                !currentCar
                  ? "border-primary/50 bg-primary/10 cursor-default"
                  : "border-border/60 bg-card/60 hover:bg-secondary/40 cursor-pointer"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-secondary">
                  <UserMinus className="w-4 h-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">Не распределены</p>
                  <p className="text-xs text-muted-foreground">Без привязки к машине</p>
                </div>
              </div>
              {!currentCar && (
                <span className="text-xs font-semibold text-primary flex items-center">
                  <Check className="w-4 h-4 mr-1" /> Текущее
                </span>
              )}
            </div>

            {/* List of Cars */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {cars.map((car) => {
                const isCurrent = currentCar?.id === car.id;
                const passengerCapacity = car.totalSeats - 1;
                const freeSeats = passengerCapacity - (car.passengers?.length || 0);
                const isFull = freeSeats <= 0 && !isCurrent;

                return (
                  <div
                    key={car.id}
                    onClick={() => {
                      if (isPending || isCurrent || isFull) return;
                      handleMove(car.id);
                    }}
                    className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? "border-primary/50 bg-primary/10 cursor-default"
                        : isFull
                        ? "border-border/40 bg-secondary/10 opacity-60 cursor-not-allowed"
                        : "border-border/60 bg-card/60 hover:bg-secondary/40 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2 rounded-full bg-primary/10 shrink-0">
                        <Car className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {car.driver?.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {car.carModel || "Авто"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      {isCurrent ? (
                        <span className="text-xs font-semibold text-primary flex items-center">
                          <Check className="w-4 h-4 mr-1" /> Здесь
                        </span>
                      ) : isFull ? (
                        <span className="text-xs text-destructive font-medium">
                          Мест нет
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium border border-green-500/20">
                          {freeSeats} мест свободно
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="pt-2 flex justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isPending}
            className="cursor-pointer"
          >
            Закрыть
          </Button>
        </div>
      </div>
    </Modal>
  );
}
