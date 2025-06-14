import { Routes } from '@angular/router';
import { ThemePaletteComponent } from './theme-palette/theme-palette.component';
import { AppComponent } from './app.component/app.component';
import { TaleDiceComponent } from './tale-dice/tale-dice.component';
import { TeacherPageComponent } from './teacher-page/teacher-page.component'


export const routes: Routes = [
  { path: '', component: TaleDiceComponent},
  { path: 'teacher', component: TeacherPageComponent},
  // main.ts does this already using bootstrapApplication()
  { path: 'theme-palette', component: ThemePaletteComponent}
];
