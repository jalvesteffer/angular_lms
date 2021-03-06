import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'borrowerSort'
})
export class BorrowerSortPipe implements PipeTransform {

  transform(input: any[]): any {
    if (input) {
      return input.sort((a, b) => {
        let bn1: string = a.name.toLowerCase();
        let bn2: string = b.name.toLowerCase();
        return bn1 < bn2 ? -1 : bn1 > bn2 ? 1 : 0;
      });
    }
  }
}
