export interface RoomInterface {
  id?: string;
  name: string;
  startTime: string;
  endTime: string;
  time_block: number;
  createdAt?: Date;
  updatedAt?: Date;
}
