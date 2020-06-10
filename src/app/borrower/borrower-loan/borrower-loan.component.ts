import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Loan } from "../loan";

@Component({
  selector: "app-borrower-loan",
  templateUrl: "./borrower-loan.component.html",
  styleUrls: ["./borrower-loan.component.css"],
})
export class BorrowerLoanComponent implements OnInit {
  @Input("loan") data: Loan;
  @Output("loanClicked") clicked = new EventEmitter<Loan>();

  constructor() {}

  clickLoan() {
    this.clicked.emit(this.data);
  }

  ngOnInit() {}
}
