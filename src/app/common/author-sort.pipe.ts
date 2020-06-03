import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'authorSort'
})
export class AuthorSortPipe implements PipeTransform {

  transform(input: any[]): any {
    if (input) {
      return input.sort((a, b) => {
        let an1: string = a.authorName.toLowerCase();
        let an2: string = b.authorName.toLowerCase();
        return an1 < an2 ? -1 : an1 > an2 ? 1 : 0;
      });
    }
  }
}
