import { Component, OnInit } from '@angular/core';
import { Loan } from '../loan';
import { BorrowerService} from '../../common/services/borrower.service';

@Component({
  selector: 'app-loan-list',
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.css']
})
export class LoanListComponent implements OnInit {
  loans: Loan[];

  constructor(private lms: BorrowerService) { 
    lms.bookBorrowed.subscribe(obs => {
      this.getLoans();
    })    
  }

  onClicked(loan: Loan) {
    this.lms.returnLoan(loan).subscribe((res) => {
      this.getLoans();
      this.lms.bookReturned.next();
    });
  }

  getLoans() {
    this.lms.getAllLoans().subscribe((res) => {
      this.loans = res;
    });
  }

  ngOnInit() {
    this.getLoans()
  }
}
