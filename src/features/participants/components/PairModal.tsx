"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Link2, Unlink } from "lucide-react";
import pairParticipants from "../actions/pairParticipants";
import unpairParticipant from "../actions/unpairParticipant";
import { toast } from "sonner";
import { Participant, CarWithRelations } from "@/features/trips/types";

interface PairModalProps {
  isOpen: boolean;
  onClose: () => void;
  participant: Participant | null;
  allParticipants: Participant[];
  cars: CarWithRelations[];
  tripId: string;
}

export function PairModal({
  isOpen,
  onClose,
  participant,
  allParticipants,
  cars,
  tripId,
}: PairModalProps) {
  const [isPending, startTransition] = React.useTransition();
  const [search, setSearch] = React.useState("");

  if (!participant) return null;

  const currentPartner = participant.partnerId
    ? allParticipants.find((p) => p.id === participant.partnerId) || participant.partner
    : null;

  // Filter out current participant
  const candidates = allParticipants.filter((p) => p.id !== participant.id);

  // Search filter
  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const getParticipantLocation = (p: Participant) => {
    const driverCar = cars.find((c) => c.driverId === p.id);
    if (driverCar) return `Водитель (${driverCar.carModel || "Авто"})`;
    const passengerCar = cars.find((c) => (c.passengers || []).some((pass) => pass.id === p.id));
    if (passengerCar) return `Пассажир (${passengerCar.carModel || "Авто"})`;
    return "Не распределен";
  };

  const handlePair = (partnerId: string) => {
    startTransition(async () => {
      const result = await pairParticipants(participant.id, partnerId, tripId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Участники связаны в пару`);
        onClose();
      }
    });
  };

  const handleUnpair = () => {
    startTransition(async () => {
      const result = await unpairParticipant(participant.id, tripId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Пара разъединена");
        onClose();
      }
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Связать в пару"
      description={`Выберите партнера для ${participant.name}. Пары визуально связываются на доске.`}
    >
      <div className="space-y-4 py-2">
        {/* Current pair status banner */}
        {currentPartner ? (
          <div className="flex items-center justify-between p-3 rounded-lg border border-primary/30 bg-primary/10">
            <div className="flex items-center space-x-2">
              <Link2 className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-medium">Сейчас в паре с:</p>
                <p className="text-sm font-semibold text-primary">{currentPartner.name}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="destructive"
              disabled={isPending}
              onClick={handleUnpair}
              className="cursor-pointer shrink-0"
            >
              <Unlink className="w-3.5 h-3.5 mr-1.5" />
              Разорвать пару
            </Button>
          </div>
        ) : (
          <div className="p-2.5 rounded-lg border border-dashed border-border bg-secondary/20 text-xs text-muted-foreground text-center">
            {participant.name} пока не состоит в паре
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск по имени..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-secondary/40 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Candidates list */}
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {filteredCandidates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Других участников не найдено
            </p>
          ) : (
            filteredCandidates.map((cand) => {
              const isAlreadyPartner = cand.id === participant.partnerId;
              const hasAnotherPartner = Boolean(cand.partnerId && cand.partnerId !== participant.id);
              const existingPartnerName = hasAnotherPartner
                ? allParticipants.find((p) => p.id === cand.partnerId)?.name
                : null;

              return (
                <div
                  key={cand.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg border transition-colors ${
                    isAlreadyPartner
                      ? "border-primary/50 bg-primary/10"
                      : "border-border/60 bg-card/60 hover:bg-secondary/40"
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <p className="text-sm font-medium truncate">{cand.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-muted-foreground">
                      <span>{getParticipantLocation(cand)}</span>
                      {hasAnotherPartner && (
                        <span className="text-orange-400">
                          • в паре с {existingPartnerName}
                        </span>
                      )}
                    </div>
                  </div>

                  {isAlreadyPartner ? (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={handleUnpair}
                      className="cursor-pointer shrink-0 text-xs"
                    >
                      <Unlink className="w-3.5 h-3.5 mr-1" />
                      Расцепить
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => handlePair(cand.id)}
                      className="cursor-pointer shrink-0 text-xs hover:border-primary hover:text-primary"
                    >
                      <Link2 className="w-3.5 h-3.5 mr-1" />
                      В пару
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>

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
