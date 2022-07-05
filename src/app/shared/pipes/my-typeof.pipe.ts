import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'myTypeof'
})
export class MyTypeofPipe implements PipeTransform {
  transform(value: unknown): "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" {
    return typeof value;
  }
}