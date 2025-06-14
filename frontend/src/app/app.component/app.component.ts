import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TaleDiceComponent } from '../tale-dice/tale-dice.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    TaleDiceComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'momo';

  isLoggedIn: boolean = false;

  login(): void {
    this.isLoggedIn = true;
  }

  logout(): void{
    this.isLoggedIn = false;
  }

}
