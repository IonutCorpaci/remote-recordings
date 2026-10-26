import * as React from "react";
import { Users, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { TripWithRelations, CarWithRelations, Participant } from "../types";

interface TripStatsProps {
  trip: TripWithRelations;
  cars: CarWithRelations[];
  unassigned: Participant[];
  emptySeatsCount: number;
  onOpenAllParticipants?: () => void;
}

export function TripStats({
  trip,
  cars,
  unassigned,
  emptySeatsCount,
  onOpenAllParticipants,
}: TripStatsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pb-2">
      <Card
        onClick={onOpenAllParticipants}
        className={`bg-primary/5 border-primary/20 transition-all ${
          onOpenAllParticipants
            ? "cursor-pointer hover:bg-primary/15 hover:border-primary/50 active:scale-[0.98] group"
            : "cursor-default"
        }`}
        title={onOpenAllParticipants ? "Посмотреть всех участников" : undefined}
      >
        <CardContent className="p-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-primary/20 group-hover:bg-primary/30 transition-colors">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                Людей
                {onOpenAllParticipants && (
                  <span className="text-[10px] text-primary underline underline-offset-2 opacity-80 group-hover:opacity-100">
                    список
                  </span>
                )}
              </p>
              <p className="text-lg font-bold leading-tight">{trip.participants?.length || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
        <Card className="bg-purple-500/5 border-purple-500/20 transition-all hover:bg-purple-500/10 cursor-default">
          <CardContent className="p-3 flex items-center space-x-3">
            <div className="p-2 rounded-full bg-purple-500/20">
              <Car className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Машин</p>
              <p className="text-lg font-bold leading-tight">{cars.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20 transition-all hover:bg-green-500/10 cursor-default">
          <CardContent className="p-3 flex items-center space-x-3">
            <div className="p-2 rounded-full bg-green-500/20">
              <div className="w-4 h-4 text-green-400 font-bold flex items-center justify-center text-xs">{emptySeatsCount}</div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Свободно</p>
              <p className="text-lg font-bold leading-tight">{emptySeatsCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20 transition-all hover:bg-destructive/10 cursor-default">
          <CardContent className="p-3 flex items-center space-x-3">
            <div className="p-2 rounded-full bg-destructive/20">
              <div className="w-4 h-4 text-destructive font-bold flex items-center justify-center text-xs">!</div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Без мест</p>
              <p className="text-lg font-bold text-destructive leading-tight">{unassigned.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
