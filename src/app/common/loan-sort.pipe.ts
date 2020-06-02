import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loanSort'
})
export class LoanSortPipe implements PipeTransform {

    transform(input: any[]): any {
        if (input) {
            return input.sort((a, b) => {
                let ln1: string = a.cardNo;
                let ln2: string = b.cardNo;
                return ln1 < ln2 ? -1 : ln1 > ln2 ? 1 : 0;
            });
        }
    }
}
