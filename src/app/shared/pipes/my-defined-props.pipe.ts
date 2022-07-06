import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myArePropsDefined'
})
export class MyDefinedPropsPipe implements PipeTransform {
  transform(value: unknown, allowedTypes: unknown[] = [0]): boolean {
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      const keys = Object.keys(obj);
      for (const key of keys) {
        if (!obj[key] && !allowedTypes.some(x => x === obj[key]))
          return false;
      }
    }
    return !!value;
  }
}
