import { Prisma } from "@/generated/prisma/client";

export type Participant = Prisma.ParticipantGetPayload<{
  include: {
    partner: true;
  };
}>;

export type TripWithRelations = Prisma.TripGetPayload<{
  include: {
    participants: {
      include: {
        partner: true;
      };
    };
    cars: {
      include: {
        driver: {
          include: {
            partner: true;
          };
        };
        passengers: {
          include: {
            partner: true;
          };
        };
      };
    };
  };
}>;

export type CarWithRelations = Prisma.CarGetPayload<{
  include: {
    driver: {
      include: {
        partner: true;
      };
    };
    passengers: {
      include: {
        partner: true;
      };
    };
  };
}>;

