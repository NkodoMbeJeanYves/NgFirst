import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toaster.service';

@Component({
// tslint:disable-next-line: component-selector
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private authService: AuthService, private toastrService: ToasterService) { }

  ngOnInit() {
  }

  AutoConnectMe() {
    this.authService.isAuth = true;
    this.toastrService.Success('Welcome user', 'Connexion established');
  }

}
