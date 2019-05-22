import { Component } from '@angular/core';
import { ToasterService } from './services/toaster.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MyFirstProject';
  constructor(private toastrService: ToasterService) {}

  Success() {
    this.toastrService.Success('My First Project With Angular', 'that\'s why i learning Angular');
  }

  Info() {
    this.toastrService.Info('My First Project With Angular', 'that\'s why i learning Angular');
  }

  Error() {
    this.toastrService.Error('My First Project With Angular', 'that\'s why i learning Angular');
  }

  Warning() {
    this.toastrService.Warning('My First Project With Angular', 'that\'s why i learning Angular');
  }
  
}
