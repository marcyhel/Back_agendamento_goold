export interface RoomInterface {
  id?: string;
  name: string;
  startTime: string;
  endTime: string;
  timeBlock: number;
  createdAt?: Date;
  updatedAt?: Date;
}
