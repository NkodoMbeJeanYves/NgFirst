import { Injectable } from '@angular/core';

declare var toastr: any;
@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  constructor() {
    this.setting();
  }

  Success(title: string, message?: string) {
    toastr.success(title, message);
  }

  Warning(message: string, title?: string) {
    toastr.warning( message, title);
  }

  Error(message: string, title?: string) {
    toastr.error( message, title);
  }

  Info(message: string, title?: string) {
    toastr.info( message, title);
  }

  setting() {
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-bottom-right",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
  }
}
