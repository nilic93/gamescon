import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './routes/login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { PacmanComponent } from './routes/components/pacman/pacman.component';
import { MemorigyComponent } from './routes/components/memorigy/memorigy.component';
import { MatchitComponent } from './routes/components/matchit/matchit.component';
import { CatchitComponent } from './routes/components/catchit/catchit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    PacmanComponent,
    MemorigyComponent,
    MatchitComponent,
    CatchitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
