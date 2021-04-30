import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { RoomsService, Room } from 'src/app/services/rooms.service'
import { AuthsService } from "../services/auths.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Router, ActivatedRoute } from "@angular/router";


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  rooms: Observable<Room[]>;
  refresh: string;

  room: Room = {
      id: '',
      admin: '',
      datecreated: '',
      name: '',
      type:''
  };

  constructor(
    private roomService: RoomsService,
    public authService: AuthsService,
    public router: Router,
    private route: ActivatedRoute,

    ) {

      let myCookie = Cookie.get('challegeuser');
      if(myCookie == null || myCookie == ''){
        this.router.navigate(['login']);
      }

    }

    ngOnInit() {
      this.rooms = this.roomService.getRoom();

      // setTimeout(() => {
      //   this.rooms = this.roomService.getRooms();
      // }, 1500);

    }

    goRoom(id: string){
      this.router.navigate(['room', {roomid: id}]);

    }
}
