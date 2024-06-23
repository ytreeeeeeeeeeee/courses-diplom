export interface IReservation {
  startDate: string;
  endDate: string;
  hotelRoom: {
    description: string | null;
    images: string[];
  };
  hotel: {
    title: string;
    description: string | null;
  };
}
