import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthentificationComponent } from './authentification/authentification.component';
import { ContactComponent } from './contact/contact.component';

const routes: Routes = [
  //quand il y a pas de parametre
  { path: '',   redirectTo: 'authentification', pathMatch: 'full' },

  // Route vers la page d'authentification 
  { path: 'authentification', component: AuthentificationComponent},

  // Route vers la page de contact 
  { path: 'contact/:id', component: ContactComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }