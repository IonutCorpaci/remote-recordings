"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import assignParticipant from "@/features/participants/actions/assignParticipant";
import { toast } from "sonner";
import { Participant } from "../types";

export function AssignParticipantModal({ 
  isOpen, 
  onClose, 
  unassigned, 
  tripId,
  carId 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  unassigned: Participant[], 
  tripId: string,
  carId: string
}) {
  const [isPending, startTransition] = React.useTransition();

  const handleAssign = (participantId: string) => {
    startTransition(async () => {
      const result = await assignParticipant(participantId, carId, tripId);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Участник добавлен в машину");
        onClose();
      }
    });
  };

  return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Добавить пассажира"
        description="Выберите участника из нераспределенных."
      >
        <div className="space-y-4 py-2">
          {unassigned.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Нет нераспределенных участников.</p>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {unassigned.map((participant) => (
                <div 
                  key={participant.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50 hover:bg-secondary/50 transition-colors"
                >
                  <span className="font-medium text-sm">{participant.name}</span>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    disabled={isPending}
                    onClick={() => handleAssign(participant.id)}
                    className="cursor-pointer"
                  >
                    Добавить
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="cursor-pointer">
              Закрыть
            </Button>
          </div>
        </div>
      </Modal>
  );
}
