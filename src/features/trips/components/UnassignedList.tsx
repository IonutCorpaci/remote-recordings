"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import addParticipant from "@/features/participants/actions/addParticipant";
import removeParticipant from "@/features/participants/actions/removeParticipant";
import { useDroppable } from "@dnd-kit/core";
import { DraggableParticipant } from "./DraggableParticipant";
import { toast } from "sonner";
import { Participant } from "../types";

export function UnassignedList({ unassigned, tripId, isReadOnly = false }: { unassigned: Participant[], tripId: string, isReadOnly?: boolean }) {
  const [isPending, startTransition] = React.useTransition();
  const [newParticipantName, setNewParticipantName] = React.useState("");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  const { isOver, setNodeRef } = useDroppable({
    id: "unassigned",
    disabled: isReadOnly,
  });

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    if (!newParticipantName.trim()) return;
    
    startTransition(async () => {
      const result = await addParticipant(tripId, newParticipantName.trim());
      if (result?.error) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        toast.error(result.error);
      } else {
        setNewParticipantName("");
        toast.success("Участник добавлен");
      }
    });
  };

  const handleRemoveParticipant = (id: string) => {
    if (!confirm("Удалить участника навсегда?")) return;
    startTransition(async () => {
      const result = await removeParticipant(id, tripId);
      if (result?.error) toast.error(result.error);
      else toast.success("Участник удален");
    });
  };

  return (
        <div className="lg:col-span-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center">
              Не распределены
              <Badge variant="secondary" className="ml-2">{unassigned.length}</Badge>
            </h3>
          </div>
          <Card 
            ref={setNodeRef}
            className={`bg-secondary/20 border-dashed border-white/20 min-h-[150px] lg:max-h-[calc(100vh-200px)] overflow-y-auto transition-colors ${isOver ? 'bg-secondary/40 border-primary' : ''}`}
          >
            <CardContent className="p-3 space-y-3 pt-3">
              {!isReadOnly && (
                <form onSubmit={handleAddParticipant} className="flex flex-col space-y-2 mb-4">
                  <div className="flex space-x-2 relative group">
                    <Input 
                      value={newParticipantName}
                      onChange={e => setNewParticipantName(e.target.value)}
                      disabled={isPending}
                      placeholder="Добавить участника..." 
                      className="h-10 text-sm bg-background/50 border-white/10 group-focus-within:border-primary/50 transition-colors pr-10" 
                    />
                    <Button 
                      type="submit" 
                      size="icon" 
                      variant="ghost"
                      className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-primary cursor-pointer" 
                      disabled={isPending || !newParticipantName.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  {fieldErrors.name && (
                    <p className="text-xs text-red-500 font-medium px-1">{fieldErrors.name[0]}</p>
                  )}
                </form>
              )}
              
              <div className="flex flex-col space-y-2 lg:block lg:space-y-2 gap-2">
                {unassigned.length === 0 && (
                   <p className="text-xs text-center text-muted-foreground py-4 lg:py-8">Нет участников</p>
                )}
                {unassigned.map((p: Participant) => (
                  <DraggableParticipant 
                    key={p.id} 
                    participant={p} 
                    onRemove={handleRemoveParticipant} 
                    isPending={isPending} 
                    isReadOnly={isReadOnly}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
  );
}
