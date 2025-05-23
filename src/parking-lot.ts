export interface Subscriber {
  update(event: ParkingLotEvent): void;
}

export interface Publisher {
  subscribe(subscriber: Subscriber): void;
  unsubscribe(subscriber: Subscriber): void;
  notify(event: ParkingLotEvent): void;
}

export class ParkingLotEvent {
  constructor(
    public action: "enter" | "exit",
    public lotName: string,
    public occupied: number,
    public capacity: number
  ) {}
}





export class ParkingLot implements Publisher {
  public occupied: number = 0;
  private subscribers: Subscriber[] = [];

  constructor(public name: string, public capacity: number) {}

  enter() {
    if (!this.isFull()) {
      this.occupied++;
      this.notify(new ParkingLotEvent("enter", this.name, this.occupied, this.capacity));
    } else {
      throw new Error(`the parking lot is full`);
    }
  }


  exit() {
    if (!this.isEmpty()) {
      this.occupied--;
      this.notify(new ParkingLotEvent("exit", this.name, this.occupied, this.capacity));
    } else {
      throw new Error(`the parking lot is empty`);
    }
  }

  isFull() {
    return this.occupied === this.capacity;
  }

  isEmpty() {
    return this.occupied === 0;
  }


  
  subscribe(subscriber: Subscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    this.subscribers = this.subscribers.filter((s) => s !== subscriber);
  }

  notify(event: ParkingLotEvent): void {
    for (const s of this.subscribers) {
      s.update(event);
    }
  }
}
