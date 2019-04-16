export class Geolocation {
  public latitude: number;
  public longitude: number;

  constructor(init: any = {}) {
    this.latitude = init.latitude;
    this.longitude = init.longitude;
  }
}
