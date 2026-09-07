export class CircularBuffer<T> {
  private buffer: Array<T | undefined>;
  private head: number = 0;
  private tail: number = 0;
  private isFull: boolean = false;
  public readonly capacity: number;

  constructor(capacity: number = 500) {
    this.capacity = capacity;
    this.buffer = new Array<T | undefined>(capacity);
  }

  public push(item: T): void {
    this.buffer[this.head] = item;
    this.head = (this.head + 1) % this.capacity;
    if (this.isFull) {
      this.tail = (this.tail + 1) % this.capacity;
    }
    if (this.head === this.tail) {
      this.isFull = true;
    }
  }

  public toArray(): T[] {
    if (this.size === 0) return [];
    if (!this.isFull) {
      return this.buffer.slice(0, this.head) as T[];
    }
    return [
      ...this.buffer.slice(this.tail, this.capacity),
      ...this.buffer.slice(0, this.head),
    ] as T[];
  }

  public clear(): void {
    this.head = 0;
    this.tail = 0;
    this.isFull = false;
    this.buffer.fill(undefined);
  }

  public get size(): number {
    if (this.isFull) return this.capacity;
    return this.head;
  }
}
