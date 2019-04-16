export class Address {
  public LineOne: string;

  public LineTwo: string;

  public City: string;

  public State: string;

  public Zip: string;

  constructor(init: any = {}) {
    this.LineOne = init.LineOne;
    this.LineTwo = init.LineTwo;
    this.City = init.city;
    this.State = init.state;
    this.Zip = init.Zip;
  }
}
