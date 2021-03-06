import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'titleSort'
})
export class TitleSortPipe implements PipeTransform {

  transform(input: any[]): any {
    if (input) {
      return input.sort((a, b) => {
        let tn1: string = a.title.toLowerCase();
        let tn2: string = b.title.toLowerCase();
        return tn1 < tn2 ? -1 : tn1 > tn2 ? 1 : 0;
      });
    }
  }
}
