"use client";

import * as React from "react";
import { GripVertical, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDraggable } from "@dnd-kit/core";
import { Participant } from "../types";

interface DraggableParticipantProps {
  participant: Participant;
  onRemove?: (id: string) => void;
  onUnassign?: (id: string) => void;
  isPending?: boolean;
  index?: number;
  isReadOnly?: boolean;
}

export function DraggableParticipant({ participant, onRemove, onUnassign, isPending, index, isReadOnly = false }: DraggableParticipantProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: participant.id,
    disabled: isReadOnly,
    data: {
      participant,
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 1,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`flex items-center justify-between p-2 rounded-lg bg-card border shadow-sm transition-all group ${isDragging ? 'border-primary shadow-lg ring-1 ring-primary' : 'border-border/50 hover:border-primary/50 hover:shadow-md'}`}
    >
      <div className="flex items-center">
        {index !== undefined && (
          <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center mr-2 text-[10px] text-muted-foreground font-medium">{index + 1}</div>
        )}
        <span className="font-medium text-sm transition-colors">{participant.name}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        {!isReadOnly && onUnassign && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 text-muted-foreground hover:text-orange-500 transition-colors cursor-pointer"
            onClick={() => onUnassign(participant.id)}
            disabled={isPending}
            title="Высадить пассажира"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
        {!isReadOnly && onRemove && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
            onClick={() => onRemove(participant.id)}
            disabled={isPending}
            title="Удалить навсегда"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
        {!isReadOnly && (
          <div 
            {...listeners} 
            {...attributes} 
            className="cursor-grab active:cursor-grabbing p-1 touch-none"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
          </div>
        )}
      </div>
    </div>
  );
}
