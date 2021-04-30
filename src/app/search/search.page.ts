import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SearchService, User } from 'src/app/services/search.service'
import { RoomsService, Room } from 'src/app/services/rooms.service'
import { AuthsService } from "../services/auths.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage {

  rooms: Observable<User[]>;
  refresh: string;
  myCookie: string;
  username: string;
  users: Observable<User[]>;
  currentUser: string;


  user: User = {
    id: '',
    datejoined: '',
    discipline: '',
    dob: '',
    email: '',
    role: '',
    username: ''

  }

  constructor(
    private searchService: SearchService,
    public authService: AuthsService,
    public router: Router,
    private route: ActivatedRoute,
    private roomService: RoomsService,

    ) {

      this.myCookie = Cookie.get('challegeuser');
      if(this.myCookie == null || this.myCookie == ''){
        this.router.navigate(['login']);
      }

    }

    ngOnInit() {

      this.roomService.getUsername(this.myCookie);

      setTimeout(() => {
      this.currentUser = this.roomService.getUsernameForSearch();

      }, 1500);

    }

    searchUser(username){
     this.users = this.searchService.getUsers(username.value)
    }

    goRoom(target: string){
      console.log('1----------------> ' + this.currentUser + " / " + target)
      this.router.navigate(['room', {username: this.currentUser, target: target}]);
    }
}
