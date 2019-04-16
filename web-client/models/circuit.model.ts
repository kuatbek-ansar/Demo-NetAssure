import { Vendor } from './vendor.model';

// Global weightings for combining the parts of the value score.
const valueMetricWeights = {
  market: 0.25,
  packetLoss: 0.15,
  latency: 0.10,
  uptime: 0.20,
  utilizationSend: 0.15,
  utilizationReceive: 0.15,
};

const scalingFactor = 800;

export class ValueScoreMetrics {
  market: number;
  packetLoss: number;
  latency: number;
  uptime: number;
  utilizationSend: number;
  utilizationReceive: number;
}

export class SlaCheck {
  measuredValue: number;
  slaValue: number;
  isViolated: boolean;
}

export class SlaViolations {
  availability: SlaCheck;
  throughputSend: SlaCheck;
  throughputReceive: SlaCheck;
  jitter: SlaCheck;
  packetLoss: SlaCheck;
  latency: SlaCheck;

  public get total(): number {
    let total = 0;
    if (this.availability && this.availability.isViolated) {
      total++;
    }
    if (this.throughputSend && this.throughputSend.isViolated) {
      total++;
    }
    if (this.throughputReceive && this.throughputReceive.isViolated) {
      total++;
    }
    if (this.jitter && this.jitter.isViolated) {
      total++;
    }
    if (this.packetLoss && this.packetLoss.isViolated) {
      total++;
    }
    if (this.latency && this.latency.isViolated) {
      total++;
    }
    return total;
  }
}

export class CircuitMonitoringData {
  // average number of ms of latency over the past week
  latency: number;

  // averge packet loss % over the last week
  packetLoss: number;

  // average uptime % over the last week
  uptime: number;

  // average bytes per second in over the last week
  bpsIn: number;

  // peak number of bytes per second in over the last week
  bpsInMax: number;

  // average bytes per second out over the last week
  bpsOut: number;

  // peak number of bytes per second out over the last week
  bpsOutMax: number;
};

export class Circuit {
  circuit_id: number;
  host_id: number;
  item_id: number;
  owner_account_id: number;
  name: string;
  sla_availability: number;
  sla_throughput_send: number;
  sla_throughput_receive: number;
  sla_jitter: number;
  sla_packet_loss: number;
  sla_latency: number;
  cost: number;
  term: number;
  remote_ip: string;
  remote_host_id: number;
  vendor: Vendor;
  creationDate: Date;
  expectedMonthlyCost: number;
  monitoringData: any;
  _valueMetrics: ValueScoreMetrics;
  _valueScore: number;
  _slaViolations: SlaViolations;

  constructor(init: any) {
    Object.keys(init).forEach(k => this[k] = init[k]);
    this._valueMetrics = null;
    this._valueScore = null;
  }

  private computeMarketRateScore(): number {
    if (this.cost && this.expectedMonthlyCost) {
      return this.expectedMonthlyCost / this.cost;
    }
    return 1.0;
  }

  private computeUptimeScore(): number {
    if (this.monitoringData.uptime) {
      // uptime score not currently available
      return Number(this.monitoringData.uptime);
    }

    return 1.0;
  }

  private computeSendUtilizationScore(): number {
    if (this.sla_throughput_send) {
      const utilization = Math.min(1.0, this.monitoringData.bpsOut
        / (this.sla_throughput_send * 1024 * 1024));
      const peakUtilization = Math.min(1.0, this.monitoringData.bpsOutMax
        / (this.sla_throughput_send * 1024 * 1024));

      return 0.5 * (utilization + peakUtilization);
    }

    // Assume that unmonitored circuits have no utilization
    return 0.0;
  }

  private computeReceiveUtilizationScore(): number {
    if (this.sla_throughput_receive) {
      const utilization = Math.min(1.0, this.monitoringData.bpsIn
        / (this.sla_throughput_receive * 1024 * 1024));
      const peakUtilization = Math.min(1.0, this.monitoringData.bpsInMax
        / (this.sla_throughput_receive * 1024 * 1024));

      return 0.5 * (utilization + peakUtilization);
    }

    // Assume that unmonitored circuits have no utilization
    return 0.0;
  }

  private computePacketLossScore(): number {
    if (this.monitoringData.packetLoss) {
      return 1.0 - this.monitoringData.packetLoss;
    }

    return 1.0;
  }

  private computeLatencyScore(): number {
    if (this.monitoringData.latency) {
      const latency = this.monitoringData.latency * 1000 + 1;
      return 2.0 - Math.log10(latency) / 3.0;
      // 1 for super fast networks (less than 1ms latency)
      // 0 for networks with a 1 second latency
    }

    return 1.0;
  }

  public get valueMetrics(): ValueScoreMetrics {
    if (this._valueMetrics) {
      return this._valueMetrics;
    }

    if (this.monitoringData) {
      this._valueMetrics = {
        market: this.computeMarketRateScore() * scalingFactor * valueMetricWeights.market,
        latency: this.computeLatencyScore() * scalingFactor * valueMetricWeights.latency,
        uptime: this.computeUptimeScore() * scalingFactor * valueMetricWeights.uptime,
        utilizationSend: this.computeSendUtilizationScore() * scalingFactor * valueMetricWeights.utilizationSend,
        utilizationReceive: this.computeReceiveUtilizationScore() * scalingFactor * valueMetricWeights.utilizationReceive,
        packetLoss: this.computePacketLossScore() * scalingFactor * valueMetricWeights.packetLoss,
      }
    } else {
      this._valueMetrics = {
        market: 0,
        latency: 0,
        uptime: 0,
        utilizationSend: 0,
        utilizationReceive: 0,
        packetLoss: 0
      }
    }
    return this._valueMetrics;
  }

  public get slaViolations(): SlaViolations {
    if (this._slaViolations) {
      return this._slaViolations;
    }

    this._slaViolations = new SlaViolations();
    if (this.monitoringData) {
      this._slaViolations.availability = {
        slaValue: this.sla_availability,
        measuredValue: this.monitoringData.uptime * 100,
        isViolated: this.monitoringData.uptime * 100 < this.sla_availability
      };
      this._slaViolations.jitter = {
        slaValue: this.sla_jitter,
        measuredValue: 0,
        isViolated: false,
      };
      this._slaViolations.latency = {
        slaValue: this.sla_latency,
        measuredValue: this.monitoringData.latency * 1000,
        isViolated: this.monitoringData.latency * 1000 > this.sla_latency
      };
      this._slaViolations.packetLoss = {
        slaValue: this.sla_packet_loss,
        measuredValue: this.monitoringData.packetLoss,
        isViolated: this.monitoringData.packetLoss > this.sla_packet_loss
      };
      this._slaViolations.throughputSend = {
        slaValue: this.sla_throughput_send,
        measuredValue: 0,
        isViolated: false
      };
      this._slaViolations.throughputReceive = {
        slaValue: this.sla_throughput_receive,
        measuredValue: 0,
        isViolated: false
      };
    } else {
      this._slaViolations.availability = {
        slaValue: this.sla_availability,
        measuredValue: 0,
        isViolated: false
      };
      this._slaViolations.jitter = {
        slaValue: this.sla_jitter,
        measuredValue: 0,
        isViolated: false,
      };
      this._slaViolations.latency = {
        slaValue: this.sla_latency,
        measuredValue: 0,
        isViolated: false
      };
      this._slaViolations.packetLoss = {
        slaValue: this.sla_packet_loss,
        measuredValue: 0,
        isViolated: false
      };
      this._slaViolations.throughputSend = {
        slaValue: this.sla_throughput_send,
        measuredValue: 0,
        isViolated: false
      };
      this._slaViolations.throughputReceive = {
        slaValue: this.sla_throughput_receive,
        measuredValue: 0,
        isViolated: false
      };
    }

    return this._slaViolations;
  }

  public get valueScore(): number {
    if (this._valueScore !== null) {
      return this._valueScore;
    }

    if (!this.monitoringData) {
      return null;
    }

    const values = this.valueMetrics;
    const score = Object.keys(values).reduce((sum, k) => sum + values[k], 0);
    this._valueScore = Math.round(score);
    return this._valueScore;
  }

}
