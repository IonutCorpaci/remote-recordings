import { Prisma } from "@/generated/prisma/client";

export type TripWithRelations = Prisma.TripGetPayload<{
  include: {
    participants: true;
    cars: {
      include: {
        driver: true;
        passengers: true;
      }
    }
  }
}>;

export type CarWithRelations = Prisma.CarGetPayload<{
  include: {
    driver: true;
    passengers: true;
  }
}>;

export type Participant = Prisma.ParticipantGetPayload<Prisma.ParticipantDefaultArgs>;
