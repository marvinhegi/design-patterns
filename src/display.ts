import { Subscriber, ParkingLotEvent } from "./parking-lot.js";

export class Display implements Subscriber {
  update(event: ParkingLotEvent): void {
    const actionText =
      event.action === "enter" ? "A car entered" : "A car left";
    console.log(
      `${actionText} the lot ${event.lotName}: ${event.occupied}/${event.capacity} occupied.`
    );
    
   }
}
