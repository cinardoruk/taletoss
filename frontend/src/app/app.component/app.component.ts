import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import { TaleDiceComponent } from '../features/dice/components/tale-dice/tale-dice.component';
import { TeacherPageComponent } from '../features/dice/components/teacher-page/teacher-page.component'

//get the authService here so we can logout
import { Subject, takeUntil } from "rxjs";
import { AuthService } from '@features/auth/auth.service'


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    TaleDiceComponent,
    TeacherPageComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{

  title = 'RollTale';

  private destroySubject = new Subject();
  isLoggedIn: boolean = false;

  //subscribe to authService.authStatus observable so that
  //isLoggedIn gets updated when it changes
  constructor(
    private router: Router,
    private authService: AuthService
  ){
    this.authService.authStatus.pipe(takeUntil(this.destroySubject)).subscribe(result => {
      this.isLoggedIn = result;
    })
  }

  // but we also need to set it when the component first runs
  // on init, set isLoggedIn to the current state
  ngOnInit(): void{
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  onLogout(): void{
    this.authService.logout();
    this.router.navigate(["/"]);
  }

  ngOnDestroy(){
    this.destroySubject.next(true);
    this.destroySubject.complete();
  }

  goToTeacherPage(){
    if (this.isLoggedIn){
      this.router.navigate(["/teacher"]);
    }
    else{
      this.router.navigate(["/login"]);
    }
  }

  //conditional rendering based on current page
  //we have 2 buttons
  showWhichButtons = {
    'game': false,
    'teacher': true
  }



}
