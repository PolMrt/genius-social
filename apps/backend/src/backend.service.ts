import { Injectable } from "@nestjs/common";

@Injectable()
export class BackendService {
  getHello(): string {
    return "Hello World!";
  }

  getHola(): string {
    return "Hola";
  }
}
