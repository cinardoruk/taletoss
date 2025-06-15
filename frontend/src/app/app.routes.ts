import { Routes } from '@angular/router';
import { ThemePaletteComponent } from './features/testing/theme-palette/theme-palette.component';
import { AppComponent } from './app.component/app.component';
import { TaleDiceComponent } from './features/dice/components/tale-dice/tale-dice.component';
import { TeacherPageComponent } from './features/dice/components/teacher-page/teacher-page.component'


export const routes: Routes = [
  { path: '', component: TaleDiceComponent},
  { path: 'teacher', component: TeacherPageComponent},
  // main.ts does this already using bootstrapApplication()
  { path: 'theme-palette', component: ThemePaletteComponent}
];
