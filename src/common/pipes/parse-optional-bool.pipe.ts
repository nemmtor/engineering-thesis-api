import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseOptionalBoolPipe implements PipeTransform {
  transform(value: string) {
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch (_e) {
      return null;
    }
  }
}
