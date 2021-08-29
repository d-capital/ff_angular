import { float } from "aws-sdk/clients/lightsail";

export class DbAssets {
    constructor(
      public ticker: string,
      public exchange: string,
      public lot: number,
      public price: float,
      public name: string,
    ) { }
  }