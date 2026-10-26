"use client";

import * as React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Car, Users, UserCheck, Trash2, Link2, Unlink, ArrowRightLeft } from "lucide-react";
import removeParticipant from "@/features/participants/actions/removeParticipant";
import unpairParticipant from "@/features/participants/actions/unpairParticipant";
import { toast } from "sonner";
import { Participant, CarWithRelations } from "../types";

interface AllParticipantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  allParticipants: Participant[];
  cars: CarWithRelations[];
  tripId: string;
  isReadOnly?: boolean;
  onOpenPairModal?: (participant: Participant) => void;
  onOpenQuickMoveModal?: (participant: Participant) => void;
}

export function AllParticipantsModal({
  isOpen,
  onClose,
  allParticipants,
  cars,
  tripId,
  isReadOnly = false,
  onOpenPairModal,
  onOpenQuickMoveModal,
}: AllParticipantsModalProps) {
  const [search, setSearch] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  const driverIds = new Set(cars.map((c) => c.driverId));
  const drivers = allParticipants.filter((p) => driverIds.has(p.id));
  const passengers = allParticipants.filter((p) => Boolean(p.carId) && !driverIds.has(p.id));
  const unassigned = allParticipants.filter((p) => !p.carId && !driverIds.has(p.id));

  const filterList = (list: Participant[]) =>
    list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const filteredDrivers = filterList(drivers);
  const filteredPassengers = filterList(passengers);
  const filteredUnassigned = filterList(unassigned);

  const handleDelete = (participant: Participant) => {
    if (driverIds.has(participant.id)) {
      toast.error("Нельзя удалить участника-водителя. Сначала удалите машину.");
      return;
    }
    if (!confirm(`Удалить участника ${participant.name} навсегда?`)) return;

    startTransition(async () => {
      const result = await removeParticipant(participant.id, tripId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Участник удален");
      }
    });
  };

  const handleUnpair = (participant: Participant) => {
    startTransition(async () => {
      const result = await unpairParticipant(participant.id, tripId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Пара разъединена");
      }
    });
  };

  const getPartnerName = (p: Participant) => {
    if (!p.partnerId) return null;
    return allParticipants.find((item) => item.id === p.partnerId)?.name || p.partner?.name || null;
  };

  const renderParticipantRow = (p: Participant, roleLabel: string, roleColor: string) => {
    const partnerName = getPartnerName(p);
    const isDriver = driverIds.has(p.id);

    return (
      <div
        key={p.id}
        className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card/60 hover:bg-secondary/40 transition-colors gap-2"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm text-foreground truncate">{p.name}</span>
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${roleColor}`}>
              {roleLabel}
            </span>
          </div>

          {/* Pair badge */}
          {partnerName ? (
            <div className="flex items-center gap-1.5 mt-1 text-xs text-primary font-medium">
              <Link2 className="w-3 h-3 shrink-0" />
              <span className="truncate">В паре с {partnerName}</span>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={() => handleUnpair(p)}
                  disabled={isPending}
                  className="text-muted-foreground hover:text-destructive transition-colors ml-1 cursor-pointer"
                  title="Разорвать пару"
                >
                  <Unlink className="w-3 h-3" />
                </button>
              )}
            </div>
          ) : (
            !isReadOnly && onOpenPairModal && (
              <button
                type="button"
                onClick={() => onOpenPairModal(p)}
                className="flex items-center gap-1 mt-1 text-[11px] text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                <Link2 className="w-3 h-3" />
                <span>Связать в пару</span>
              </button>
            )
          )}
        </div>

        {/* Action buttons */}
        {!isReadOnly && (
          <div className="flex items-center space-x-1 shrink-0">
            {!isDriver && onOpenQuickMoveModal && (
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-foreground cursor-pointer"
                onClick={() => onOpenQuickMoveModal(p)}
                title="Пересадить в другую машину"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </Button>
            )}

            {!isDriver && (
              <Button
                variant="ghost"
                size="icon"
                className="w-7 h-7 text-muted-foreground hover:text-destructive cursor-pointer"
                onClick={() => handleDelete(p)}
                disabled={isPending}
                title="Удалить участника"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Все участники поездки"
      description={`Всего участников: ${allParticipants.length} (водителей: ${drivers.length}, пассажиров: ${passengers.length}, без мест: ${unassigned.length})`}
    >
      <div className="space-y-4 py-2">
        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Поиск по имени участника..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 rounded-lg border border-input bg-secondary/40 px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="space-y-4 max-h-[380px] overflow-y-auto pr-1">
          {/* Section: Drivers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5" />
                Водители ({filteredDrivers.length})
              </h4>
            </div>
            {filteredDrivers.length === 0 ? (
              <p className="text-xs text-muted-foreground italic px-2 py-1">Нет водителей</p>
            ) : (
              <div className="space-y-1.5">
                {filteredDrivers.map((d) => {
                  const car = cars.find((c) => c.driverId === d.id);
                  const label = `Водитель: ${car?.carModel || "Авто"}`;
                  return renderParticipantRow(d, label, "bg-primary/20 text-primary border border-primary/30");
                })}
              </div>
            )}
          </div>

          {/* Section: Passengers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-green-400 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Пассажиры в машинах ({filteredPassengers.length})
              </h4>
            </div>
            {filteredPassengers.length === 0 ? (
              <p className="text-xs text-muted-foreground italic px-2 py-1">Нет распределенных пассажиров</p>
            ) : (
              <div className="space-y-1.5">
                {filteredPassengers.map((p) => {
                  const car = cars.find((c) => c.id === p.carId);
                  const label = `В машине: ${car?.driver?.name || "Машина"}`;
                  return renderParticipantRow(p, label, "bg-green-500/10 text-green-400 border border-green-500/20");
                })}
              </div>
            )}
          </div>

          {/* Section: Unassigned */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-orange-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Не распределены ({filteredUnassigned.length})
              </h4>
            </div>
            {filteredUnassigned.length === 0 ? (
              <p className="text-xs text-muted-foreground italic px-2 py-1">Все участники распределены!</p>
            ) : (
              <div className="space-y-1.5">
                {filteredUnassigned.map((p) =>
                  renderParticipantRow(p, "Не распределен", "bg-orange-500/10 text-orange-400 border border-orange-500/20")
                )}
              </div>
            )}
          </div>
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
