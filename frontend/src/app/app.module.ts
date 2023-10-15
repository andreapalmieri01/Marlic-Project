//BASIC IMPORT
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

//COMPONENT IMPORTS
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { SidenavComponent } from './components/pages/dashboard/sidenav/sidenav.component';
import { LoginComponent } from './components/authentication/auth_user/login/login.component';
import { FooterComponent } from './componentsHome/footer/footer.component';
import { HeaderHomeComponent } from './componentsHome/header-home/header-home.component';
import { HeaderComponent } from './components/pages/dashboard/header/header.component';
import { PolimeriComponent } from './components/pages/dashboard/polimeriComponent/polimeri.component';
import { AdditiviComponent } from './components/pages/dashboard/additiviComponent/additivi.component';
import { AccountComponent } from './components/pages/dashboard/account/account.component';
import { RinforziComponent } from './components/pages/dashboard/rinforziComponent/rinforzi.component';

//MATERIAL
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import {FormArray, FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';



//OTHER IMPORT
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtInterceptor } from './components/authentication/services/auth.interceptor';
import {MatChipsModule} from "@angular/material/chips";

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SidenavComponent,
    LoginComponent,
    FooterComponent,
    HeaderHomeComponent,
    HeaderComponent,
    PolimeriComponent,
    AdditiviComponent,
    AccountComponent,
    RinforziComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatToolbarModule,
    MatIconModule,
    FormsModule,
    BrowserAnimationsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatListModule,
    MatDividerModule,
    MatSidenavModule,
    MatRadioModule,
    MatTableModule,
    MatDialogModule,
    MatExpansionModule,
    ScrollingModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule
  ],
  providers: [{
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary' },
  },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
