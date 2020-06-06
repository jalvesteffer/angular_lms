import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorComponent } from "./administrator/administrator.component";
import { BorrowerComponent } from "./borrower/borrower.component";
import { LibrarianComponent } from "./librarian/librarian.component";
import { HomeComponent } from "./home/home.component";
import { LmserrorComponent } from "./lmserror/lmserror.component";
import { LayoutComponent } from "./layout/layout.component";
import { AuthorComponent } from "./administrator/author/author.component";
import { BookComponent } from './administrator/book/book.component';
import { PublisherComponent } from './administrator/publisher/publisher.component';
import { GenreComponent } from './administrator/genre/genre.component';
import { BorrowerAdminComponent } from "./administrator/borrower-admin/borrower-admin.component";
import { BranchComponent } from './administrator/branch/branch.component';
import { LoanComponent } from './administrator/loan/loan.component';
import { BranchLibraryComponent } from "./librarian/branch-library/branch-library.component";
import { CopiesLibraryComponent } from "./librarian/copies-library/copies-library.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "lms/home",
        pathMatch: "full",
      },
      {
        path: "lms/home",
        component: HomeComponent,
      },
      {
        path: "lms/admin",
        component: AdministratorComponent,
      },
      {
        path: "lms/admin/author",
        component: AuthorComponent,
      },
      {
        path: "lms/admin/book",
        component: BookComponent,
      },
      {
        path: "lms/admin/publisher",
        component: PublisherComponent,
      },
      {
        path: "lms/admin/genre",
        component: GenreComponent,
      },
      {
        path: "lms/admin/borrower",
        component: BorrowerAdminComponent,
      },
      {
        path: "lms/admin/branch",
        component: BranchComponent,
      },
      {
        path: "lms/admin/loan",
        component: LoanComponent,
      },
      {
        path: "lms/borrower",
        component: BorrowerComponent,
      },
      {
        path: "lms/librarian",
        component: LibrarianComponent,
      },
      {
        path: "lms/librarian/branches",
        component: BranchLibraryComponent,
      },
      {
        path: "lms/librarian/copies",
        component: CopiesLibraryComponent,
      },
      // {
      //   path: "**",
      //   component: LmserrorComponent,
      // },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
