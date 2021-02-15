import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RouterModule, Routes } from '@angular/router';
import { CrearcuentaComponent } from './pages/crearcuenta/crearcuenta.component';
import { UsersService } from './services/users.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import * as $ from 'jquery';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { EventsService } from './services/events.service';
import { RegistrarEventComponent } from './pages/registrar-event/registrar-event.component';
// import { AgmCoreModule } from '@agm/core';
import { JwtModule } from '@auth0/angular-jwt';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'crearcuenta', component: CrearcuentaComponent },
  { path: 'registrarevent', component: RegistrarEventComponent },
  { path: '**', redirectTo: '/login' },

];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    CrearcuentaComponent,
    NavbarComponent,
    RegistrarEventComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    JwtModule.forRoot({
      config: {
        tokenGetter: function tokenGetter() {
          return localStorage.getItem('access_token');
        },
        // whitelistedDomains: ['localhost:4200'],
      }
    })
    // AgmCoreModule.forRoot({
    //   apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    // })

  ],
  providers: [
    UsersService,
    EventsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
