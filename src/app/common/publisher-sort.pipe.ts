import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'publisherSort'
})
export class PublisherSortPipe implements PipeTransform {

  transform(input: any[]): any {
    if (input) {
      return input.sort((a, b) => {
        let pn1: string = a.publisherName.toLowerCase();
        let pn2: string = b.publisherName.toLowerCase();
        return pn1 < pn2 ? -1 : pn1 > pn2 ? 1 : 0;
      });
    }
  }
}
