import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './auth/signup/signup.component';
import { SigninComponent } from './auth/signin/signin.component';
import { BookListComponent } from './books/book-list/book-list.component';
import { NewBookComponent } from './books/new-book/new-book.component';
import { SingleBookComponent } from './books/single-book/single-book.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path: 'auth/signup', component: SignupComponent},
  {path: 'auth/signin', component: SigninComponent},
  {path: 'books', canActivate: [AuthGuardService], component: BookListComponent},
  {path: 'book/add', canActivate: [AuthGuardService], component: NewBookComponent},
  {path: 'book/show/:id', canActivate: [AuthGuardService], component: SingleBookComponent},
  {path: '**', redirectTo: 'auth/signin'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
