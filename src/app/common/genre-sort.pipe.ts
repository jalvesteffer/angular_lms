import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genreSort'
})
export class GenreSortPipe implements PipeTransform {

  transform(input: any[]): any {
    if (input) {
      return input.sort((a, b) => {
        let gn1: string = a.genre_name.toLowerCase();
        let gn2: string = b.genre_name.toLowerCase();
        return gn1 < gn2 ? -1 : gn1 > gn2 ? 1 : 0;
      });
    }
  }
}
