import * as React from "react";
import { Users, Car, MapPin, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { TripWithRelations, CarWithRelations, Participant } from "../types";

export function TripStats({ trip, cars, unassigned, emptySeatsCount }: { trip: TripWithRelations, cars: CarWithRelations[], unassigned: Participant[], emptySeatsCount: number }) {
  return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 border-primary/20 transition-all hover:bg-primary/10 cursor-default">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-primary/20">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Людей</p>
              <p className="text-2xl font-bold">{trip.participants?.length || 0}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-500/5 border-purple-500/20 transition-all hover:bg-purple-500/10 cursor-default">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-purple-500/20">
              <Car className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Машин</p>
              <p className="text-2xl font-bold">{cars.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-500/5 border-green-500/20 transition-all hover:bg-green-500/10 cursor-default">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-green-500/20">
              <div className="w-5 h-5 text-green-400 font-bold flex items-center justify-center">{emptySeatsCount}</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Свободно мест</p>
              <p className="text-2xl font-bold">{emptySeatsCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20 transition-all hover:bg-destructive/10 cursor-default">
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-3 rounded-full bg-destructive/20">
              <div className="w-5 h-5 text-destructive font-bold flex items-center justify-center">!</div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">Без мест</p>
              <p className="text-2xl font-bold text-destructive">{unassigned.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
