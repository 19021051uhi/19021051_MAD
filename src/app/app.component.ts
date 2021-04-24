import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomsService, Room } from 'src/app/services/rooms.service'
import { Router } from '@angular/router';
import { AuthsService } from "./services/auths.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']

})
export class AppComponent {

  rooms: Observable<Room[]>;
  loggedIn:  boolean;
  constructor(
    private roomService: RoomsService,
    private router: Router,
    public authService: AuthsService,
    ) {

      let myCookie = Cookie.get('challegeuser');
      if(myCookie == null || myCookie == ''){
        this.loggedIn = false;
        this.router.navigate(['login']);
      }else{
        this.loggedIn = true;
      }
  }

  // ngOnInit(){
  //   this.rooms = this.roomService.getRooms();
  // }

  goHome() {
    this.router.navigate(['home']);
  }

  goAccount() {
    this.router.navigate(['account']);
  }

  goChats() {
    this.router.navigate(['chats']);
  }

  goAbout() {
    this.router.navigate(['about']);
  }

  goLogin() {
    this.router.navigate(['login']);
  }

  goRegister() {
    this.router.navigate(['register']);
  }

  logout() {
    Cookie.set('challegeuser', '');
    this.authService.SignOut();
  }

}
