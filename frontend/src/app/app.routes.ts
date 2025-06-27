// SPDX-FileCopyrightText: 2025 Çınar Doruk
//
// SPDX-License-Identifier: AGPL-3.0-only

import { Routes } from '@angular/router';
// import { ThemePaletteComponent } from './features/testing/theme-palette/theme-palette.component';
import { AppComponent } from './app.component/app.component';

import { TaleDiceComponent } from './features/dice/components/tale-dice/tale-dice.component';

import { TeacherPageComponent } from './features/dice/components/teacher-page/teacher-page.component';

import { LoginComponent } from '@features/auth/login/login.component';
import { AuthGuard } from '@features/auth/auth.guard';


export const routes: Routes = [
  { path: '', component: TaleDiceComponent},
  { path: 'login', component: LoginComponent},
  { path: 'teacher', component: TeacherPageComponent, canActivate: [AuthGuard]},
  // { path: 'theme-palette', component: ThemePaletteComponent}
];
