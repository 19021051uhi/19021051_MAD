import { Component, OnInit } from '@angular/core';
import { AuthsService } from "../services/auths.service";

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {

  constructor(public authService: AuthsService) { }

  ngOnInit() {
  }

}
