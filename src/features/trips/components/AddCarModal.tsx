"use client";

import * as React from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import addCar from "@/features/cars/actions/addCar";
import { toast } from "sonner";
import { Participant } from "../types";

export function AddCarModal({ isOpen, onClose, allParticipants, tripId }: { isOpen: boolean, onClose: () => void, allParticipants: Participant[], tripId: string }) {
  const [isPending, startTransition] = React.useTransition();
  const [driverId, setDriverId] = React.useState("");
  const [newDriverName, setNewDriverName] = React.useState("");
  const [carModel, setCarModel] = React.useState("");
  const [totalSeats, setTotalSeats] = React.useState("4");
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!driverId && !newDriverName.trim()) {
      toast.error("Укажите водителя!");
      return;
    }

    startTransition(async () => {
      const result = await addCar(
        tripId,
        driverId || null,
        newDriverName.trim() || null,
        carModel.trim() || null,
        parseInt(totalSeats) || 4
      );

      if (result?.error) {
        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }
        toast.error(result.error);
      } else {
        setDriverId("");
        setNewDriverName("");
        setCarModel("");
        setTotalSeats("4");
        toast.success("Машина добавлена");
        onClose();
      }
    });
  };

  return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Добавить машину"
        description="Назначьте водителя из существующих участников или добавьте нового."
      >
        <form onSubmit={handleSubmit} className="space-y-6 py-2">
          <div className="space-y-3">
            <label className="text-sm font-semibold">1. Кто за рулем?</label>
            <div className="space-y-2">
              <select 
                value={driverId}
                onChange={e => {
                  setDriverId(e.target.value);
                  if (e.target.value) setNewDriverName("");
                }}
                disabled={isPending}
                className="flex h-12 w-full rounded-lg border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <option value="">Выберите из списка участников...</option>
                {allParticipants.map((p: Participant) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div className="flex items-center space-x-2 py-1">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-muted-foreground uppercase font-medium">или</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <Input 
                placeholder="Имя нового участника (водителя)" 
                value={newDriverName}
                onChange={e => {
                  setNewDriverName(e.target.value);
                  if (e.target.value) setDriverId("");
                }}
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Модель авто</label>
              <Input 
                placeholder="Опционально" 
                value={carModel}
                onChange={e => setCarModel(e.target.value)}
                disabled={isPending}
              />
              {fieldErrors.carModel && (
                <p className="text-xs text-red-500 font-medium">{fieldErrors.carModel[0]}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Всего мест</label>
              <Input 
                type="number" 
                placeholder="4" 
                min="2" max="9" 
                value={totalSeats}
                onChange={e => setTotalSeats(e.target.value)}
                disabled={isPending}
              />
              {fieldErrors.totalSeats && (
                <p className="text-xs text-red-500 font-medium">{fieldErrors.totalSeats[0]}</p>
              )}
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending} className="cursor-pointer">Отмена</Button>
            <Button type="submit" disabled={isPending} className="cursor-pointer">{isPending ? "Добавление..." : "Назначить машину"}</Button>
          </div>
        </form>
      </Modal>
  );
}
