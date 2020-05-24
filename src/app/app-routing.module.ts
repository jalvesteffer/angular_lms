import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministratorComponent } from "./administrator/administrator.component";
import { BorrowerComponent } from "./borrower/borrower.component";
import { LibrarianComponent } from "./librarian/librarian.component";
import { HomeComponent } from "./home/home.component";
import { LmserrorComponent } from "./lmserror/lmserror.component";
import { LayoutComponent } from "./layout/layout.component";


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
