import { Circuit } from './circuit.model';

describe('Circuit Model', () => {
  beforeEach(() => {
  });

  describe('Value Score', () => {
    it('should return null when monitoring data is empty', () => {
      const circuit = new Circuit({});
      expect(circuit.valueScore).toBeNull();
    });

    it('should return empty valueMetrics when monitoring data is empty', () => {
      const circuit = new Circuit({});
      expect(circuit.valueMetrics).not.toBeNull();
      expect(circuit.valueMetrics.market).toBe(0);
      expect(circuit.valueMetrics.packetLoss).toBe(0);
      expect(circuit.valueMetrics.latency).toBe(0);
      expect(circuit.valueMetrics.uptime).toBe(0);
      expect(circuit.valueMetrics.utilizationSend).toBe(0);
      expect(circuit.valueMetrics.utilizationReceive).toBe(0);
    });

    it('should calculate valueMetrics when monitoring data is available', () => {
      const circuit = new Circuit({
        cost : 1000,
        expectedMonthlyCost: 1500,
        sla_throughput_send: 25,
        sla_throughput_receive: 50,
        monitoringData: {
          latency: 0.023,
          packetLoss: 0.2,
          uptime: .98,
          bpsIn: 12415122,
          bpsInMax: 12415122,
          bpsOut: 12415122,
          bpsOutMax: 12415122
        }
      });
      expect(circuit.valueMetrics).not.toBeNull();
      expect(circuit.valueMetrics.market).toBe(300);
      expect(circuit.valueMetrics.packetLoss).toBe(96);
      expect(circuit.valueMetrics.latency).toBe(123.194366887690520);
      expect(circuit.valueMetrics.uptime).toBe(156.8);
      expect(circuit.valueMetrics.utilizationSend).toBe(56.83191833496094);
      expect(circuit.valueMetrics.utilizationReceive).toBe(28.41595916748047);

    });

    it('should return calculate value score when monitoring data is available', () => {
      const circuit = new Circuit({
        cost : 1000,
        expectedMonthlyCost: 1500,
        sla_throughput_send: 50,
        sla_throughput_receive: 50,
        monitoringData: {
          latency: 0.023,
          packetLoss: 0.2,
          uptime: .98,
          bpsIn: 12415122,
          bpsInMax: 12415122,
          bpsOut: 12415122,
          bpsOutMax: 12415122
        }
      });
      expect(circuit.valueScore).toBe(733);
    });
  });

  describe('SLA Violations', () => {
    it('should return 0 when monitoring data is not set', () => {
      const circuit = new Circuit({});
      circuit.monitoringData = undefined;
      expect(circuit.slaViolations.total).toBe(0);
    });

    it('should return 1 when latency is in violation', () => {
      const circuit = new Circuit({
        sla_latency: 12,
        monitoringData: {
          latency: 0.013
        }
      });
      expect(circuit.slaViolations.total).toBe(1);
    });

    it('should return 0 when latency is not in violation', () => {
      const circuit = new Circuit({
        sla_latency: 12,
        monitoringData: {
          latency: 0.012
        }
      });
      expect(circuit.slaViolations.total).toBe(0);
    });

    it('should return 1 when uptime is in violation', () => {
      const circuit = new Circuit({
        sla_availability: 99.99,
        monitoringData: {
          uptime: 0.9998
        }
      });
      expect(circuit.slaViolations.total).toBe(1);
    });

    it('should return 0 when uptime is not in violation', () => {
      const circuit = new Circuit({
        sla_availability: 99.99,
        monitoringData: {
          uptime: 0.99999
        }
      });
      expect(circuit.slaViolations.total).toBe(0);
    });


    it('should return 1 when packet loss is in violation', () => {
      const circuit = new Circuit({
        sla_packet_loss: 0.02,
        monitoringData: {
          packetLoss: 0.021
        }
      });
      expect(circuit.slaViolations.total).toBe(1);
    });

    it('should return 0 when packet loss is not in violation', () => {
      const circuit = new Circuit({
        sla_packet_loss: 0.02,
        monitoringData: {
          packetLoss: 0.019
        }
      });
      expect(circuit.slaViolations.total).toBe(0);
    });

    it('should return 3 when multiple violations', () => {
      const circuit = new Circuit({
        sla_packet_loss: 0.02,
        sla_availability: 99.999,
        sla_latency: 12,
        monitoringData: {
          packetLoss: 0.021,
          uptime: 0.998,
          latency: 0.0121
        }
      });
      expect(circuit.slaViolations.total).toBe(3);
    });
  })

});
