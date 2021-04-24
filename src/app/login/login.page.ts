import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthsService } from "../services/auths.service";
import { Cookie } from 'ng2-cookies/ng2-cookies';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  refresh: string;

  constructor(
    public authService: AuthsService,
    public router: Router,
    private route: ActivatedRoute
  ) {

    let myCookie = Cookie.get('challegeuser');
    if(myCookie != null && myCookie != ''){
      this.router.navigate(['home']);
    }

  }


  ngOnInit() {
    // let refresh = this.route.snapshot.paramMap.get('refresh');
    // if(refresh == 'true'){
    //   window.location.reload;
    // }

  }


  logIn(email, password) {
    this.authService.SignIn(email.value, password.value)
      .then((res) => {
        Cookie.set('challegeuser', res.user.email);
        this.router.navigate(['home', {refreshs:'true'}]);
      }).catch((error) => {
        Cookie.set('challegeuser','');
        window.alert(error.message)
      })
  }

}
