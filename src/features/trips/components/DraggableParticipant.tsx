"use client";

import * as React from "react";
import { GripVertical, Trash2, X, Link2, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDraggable } from "@dnd-kit/core";
import { Participant } from "../types";

interface DraggableParticipantProps {
  participant: Participant;
  onRemove?: (id: string) => void;
  onUnassign?: (id: string) => void;
  onOpenPairModal?: (participant: Participant) => void;
  onOpenQuickMoveModal?: (participant: Participant) => void;
  partnerName?: string | null;
  isPending?: boolean;
  index?: number;
  isReadOnly?: boolean;
}

export function DraggableParticipant({
  participant,
  onRemove,
  onUnassign,
  onOpenPairModal,
  onOpenQuickMoveModal,
  partnerName,
  isPending,
  index,
  isReadOnly = false,
}: DraggableParticipantProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: participant.id,
    disabled: isReadOnly,
    data: {
      participant,
    },
  });

  const partnerDisplay = partnerName || participant.partner?.name;

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-between p-2.5 rounded-lg bg-card border shadow-sm transition-all group ${
        isDragging
          ? "opacity-30 border-dashed border-primary/70 scale-[0.98]"
          : "border-border/60 hover:border-primary/50 hover:shadow-md"
      }`}
    >
      <div className="flex items-center min-w-0 pr-2">
        {index !== undefined && (
          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center mr-2 text-[10px] text-muted-foreground font-medium shrink-0">
            {index + 1}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-medium text-sm text-foreground truncate">
              {participant.name}
            </span>
            {partnerDisplay && (
              <button
                type="button"
                onClick={() => !isReadOnly && onOpenPairModal && onOpenPairModal(participant)}
                className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors font-medium shrink-0 cursor-pointer"
                title={`В паре с ${partnerDisplay}. Нажмите для изменения.`}
              >
                <Link2 className="w-2.5 h-2.5" />
                <span className="truncate max-w-[90px]">{partnerDisplay}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-1 shrink-0">
        {!isReadOnly && !partnerDisplay && onOpenPairModal && (
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            onClick={() => onOpenPairModal(participant)}
            disabled={isPending}
            title="Связать в пару"
          >
            <Link2 className="w-3.5 h-3.5" />
          </Button>
        )}

        {!isReadOnly && onOpenQuickMoveModal && (
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            onClick={() => onOpenQuickMoveModal(participant)}
            disabled={isPending}
            title="Пересадить в другую машину"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </Button>
        )}

        {!isReadOnly && onUnassign && (
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-muted-foreground hover:text-orange-500 transition-colors cursor-pointer"
            onClick={() => onUnassign(participant.id)}
            disabled={isPending}
            title="Высадить пассажира"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        )}

        {!isReadOnly && onRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="w-7 h-7 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            onClick={() => onRemove(participant.id)}
            disabled={isPending}
            title="Удалить навсегда"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}

        {!isReadOnly && (
          <div
            {...listeners}
            {...attributes}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-secondary/60 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none select-none transition-colors"
            title="Зажмите и перетащите"
          >
            <GripVertical className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

/** Snapshot for DragOverlay while moving */
export function ParticipantDragOverlay({
  participant,
  partnerName,
}: {
  participant: Participant;
  partnerName?: string | null;
}) {
  const partnerDisplay = partnerName || participant.partner?.name;

  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-card/95 border-2 border-primary shadow-2xl ring-2 ring-primary/40 backdrop-blur-md cursor-grabbing scale-105 select-none w-64 pointer-events-none">
      <div className="flex items-center min-w-0 pr-2">
        <div className="min-w-0">
          <span className="font-semibold text-sm text-foreground truncate block">
            {participant.name}
          </span>
          {partnerDisplay && (
            <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded bg-primary/20 text-primary font-medium mt-0.5">
              <Link2 className="w-2.5 h-2.5" />
              В паре с {partnerDisplay}
            </span>
          )}
        </div>
      </div>
      <div className="w-7 h-7 flex items-center justify-center text-primary">
        <GripVertical className="w-4 h-4" />
      </div>
    </div>
  );
}
