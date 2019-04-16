import { Metric as Item } from './item.model';

export class Graph {
  public groupIds: string[];

  public graphId: string;

  public name: string;

  public width: number;

  public height: number;

  public yAxisMinimum: number;

  public yAxisMaximum: number;

  public items: Item[];

  public gitems: any[];

  constructor(init: any = {}) {
    this.graphId = init.graphId || init.graphid;
    this.name = init.name;
    this.width = init.width;
    this.height = init.height;
    this.yAxisMinimum = init.yAxisMinimum || init.yaxismin;
    this.yAxisMaximum = init.yAxisMaximum || init.yaxismax;
    this.items = init.items;
    this.groupIds = init.groupIds || init.groups.map((group: any) => group.groupid);
  }

  // Deprecated - prefer using zabbix class names
  public get metrics() {
    return this.items;
  }

  public set metrics(items) {
    this.items = items;
  }
}
