import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { LibrarianComponent } from './librarian/librarian.component';
import { BorrowerComponent } from './borrower/borrower.component';
import { AuthorComponent } from './administrator/author/author.component';
import { BookComponent } from './administrator/book/book.component';
import { HomeComponent } from './home/home.component';
import { LmserrorComponent } from './lmserror/lmserror.component';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { PublisherComponent } from './administrator/publisher/publisher.component';
import { BranchComponent } from './administrator/branch/branch.component';
import { GenreComponent } from './administrator/genre/genre.component';
import { LoanComponent } from './administrator/loan/loan.component';
import { BorrowerAdminComponent } from './administrator/borrower-admin/borrower-admin.component';
import { LmsService } from "./common/services/lms.service";
import { BranchLibraryComponent } from './librarian/branch-library/branch-library.component';
import { CopiesLibraryComponent } from './librarian/copies-library/copies-library.component';

@NgModule({

  declarations: [
    AppComponent,
    AdministratorComponent,
    LayoutComponent,
    LmserrorComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    LibrarianComponent,
    AuthorComponent,
    BookComponent,
    PublisherComponent,
    GenreComponent,
    BorrowerComponent,
    BranchComponent,
    LoanComponent,
    BorrowerAdminComponent,
    BranchLibraryComponent,
    CopiesLibraryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgMultiSelectDropDownModule
  ],
  providers: [LmsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
