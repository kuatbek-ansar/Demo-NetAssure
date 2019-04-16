export class PredictiveDataGraphData {
  data: PredictiveDataSeries[];
  labels: string[];
}

export class PredictiveDataSeries {
  data: number[];
  label: string;
}
export class PredictiveData {
  predictiveData: PredictiveDataGraphData;
  lowBitsSent: number;
  averageBitsSent: number;
  highBitsSent: number;
  lowBitsReceived: number;
  averageBitsReceived: number;
  highBitsReceived: number;
  willBreachSLA: boolean;
  willBreachSLAIn: string;

  constructor() {
    this.predictiveData = new PredictiveDataGraphData();
  }
}
