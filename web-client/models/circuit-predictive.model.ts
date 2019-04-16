export class CircuitPredictiveEntry {
  date: Date;
  bitsSent: number;
  bitsReceived: number;
}

export class CircuitPredictive {

  predictiveData: CircuitPredictiveEntry[];
  lowBitsSent: number;
  averageBitsSent: number;
  highBitsSent: number;
  lowBitsReceived: number;
  averageBitsReceived: number;
  highBitsReceived: number;
  willBreachSLA: boolean;
  willBreachSLAIn: string;
}
