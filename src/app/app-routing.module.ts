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
import { BranchComponent } from './administrator/branch/branch.component';
import { LoanComponent } from './administrator/loan/loan.component';


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
        component: BorrowerComponent,
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
        path: "**",
        component: LmserrorComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
