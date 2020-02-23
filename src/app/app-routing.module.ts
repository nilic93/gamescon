import {NgModule} from '@angular/core';
import {Routes, RouterModule, PRIMARY_OUTLET} from '@angular/router';
import {LoginComponent} from './routes/login/login.component';
import {CatchitComponent} from './routes/components/catchit/catchit.component';
import {MatchitComponent} from './routes/components/matchit/matchit.component';
import {MemorigyComponent} from './routes/components/memorigy/memorigy.component';
import {PacmanComponent} from './routes/components/pacman/pacman.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
    outlet: PRIMARY_OUTLET
  },
  {
    path: 'login',
    component: LoginComponent,
    outlet: PRIMARY_OUTLET
  },
  {
    path: 'catchit',
    component: CatchitComponent,
  },
  {
    path: 'matchit',
    component: MatchitComponent,
  },
  {
    path: 'memorigy',
    component: MemorigyComponent,
  },
  {
    path: 'pacman',
    component: PacmanComponent,
  },
];

// @ts-ignore
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
