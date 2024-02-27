import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { FooterComponent } from './components/layouts/footer/footer.component';
import { PageNotFoundComponent } from './components/layouts/page-not-found/page-not-found.component';
import { HomeComponent } from './components/home/home.component';
import { CatsComponent } from './components/animals/cats/cats.component';
import { DogsComponent } from './components/animals/dogs/dogs.component';
import { PetComponent } from './components/pet/pet.component';
import { HeaderComponent } from './components/layouts/header/header.component';
import { LoginComponent } from './components/layouts/login/login.component';
import { RegisterComponent } from './components/layouts/register/register.component';
import { AddPetComponent } from './components/add-pet/add-pet.component';
import { TimetableComponent } from './components/timetable/timetable.component';

import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from './pipes/safe.pipe';

import { environment } from 'src/environments/environment.development';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { authGuard } from './guards/auth.guard';



const routes: Routes = [
  { path: "home", component: HomeComponent},
  { path: "login", component: LoginComponent, canActivate:[authGuard]},
  { path:"register", component: RegisterComponent, canActivate:[authGuard]},
  { path: "cats", component: CatsComponent },
  { path: "dogs", component: DogsComponent },
  { 
    path: "pet", 
    children: [
      { path: ":name", component: PetComponent},
      { path: "", redirectTo: '/home', pathMatch: 'full' }
    ]
  },
  { path: "addAnimal", component: AddPetComponent, canActivate:[authGuard]},
  { 
    path: "editAnimal",
    children: [
      { path: ":name", component: AddPetComponent, canActivate:[authGuard]},
      { path: "", redirectTo: '/home', pathMatch: 'full' }
    ]
  
  },
  {
    path: "timetable",
    children: [
      { path: ":name", component: TimetableComponent, canActivate:[authGuard]},
      { path: "", redirectTo: '/home', pathMatch: 'full'}
    ]
  },
  { path: "", redirectTo: '/home', pathMatch: 'full' },
  { path: "**", component: PageNotFoundComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CatsComponent,
    DogsComponent,
    PetComponent,
    SafePipe,
    LoginComponent,
    RegisterComponent,
    AddPetComponent,
    TimetableComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
