import { HttpParams } from '@angular/common/http';

export class HttpRestParams {
  private base: HttpParams;

  constructor(fromString?: string) {
    this.base = new HttpParams({fromString: fromString});
  }

  public set(key: string, value: string): HttpRestParams {
    this.base = this.base.set(key, value);

    return this;
  }

  public toString(): string {
    return this.base.keys()
      .map(key => {
        return this.base.get(key);
      })
      .join('/');
  }
}
