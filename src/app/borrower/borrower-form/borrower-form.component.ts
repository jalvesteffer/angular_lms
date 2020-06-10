import { Component, OnInit } from "@angular/core";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { FormControl } from "@angular/forms";
import { BorrowerService } from "../../common/services/borrower.service";

@Component({
  selector: "app-borrower-form",
  templateUrl: "./borrower-form.component.html",
  styleUrls: ["./borrower-form.component.css"],
})
export class BorrowerFormComponent implements OnInit {
  searchField: FormControl;
  searches: string[] = [];

  constructor(private lms: BorrowerService) { }

  ngOnInit() {
    this.searchField = new FormControl();
    this.searchField.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    )
    .subscribe(term => {
      this.lms.searched(term);
    });
  }
}
