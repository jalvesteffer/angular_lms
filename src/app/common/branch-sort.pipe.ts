import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'branchSort'
})
export class BranchSortPipe implements PipeTransform {
  transform(input: any[]): any {
    if (input) {
      return input.sort((a, b) => {
        let bn1: string = a.branchName;
        let bn2: string = b.branchName;
        return bn1 < bn2 ? -1 : bn1 > bn2 ? 1 : 0;
      });
    }
  }
}
