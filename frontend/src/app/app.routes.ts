import { Routes } from '@angular/router';
import { ThemePaletteComponent } from './theme-palette/theme-palette.component';
import { TaleDiceComponent } from './tale-dice/tale-dice.component';
import { AppComponent } from './app.component/app.component';


export const routes: Routes = [
  { path: '', component: TaleDiceComponent},
  // main.ts does this already using bootstrapApplication()
  { path: 'theme-palette', component: ThemePaletteComponent}
];
