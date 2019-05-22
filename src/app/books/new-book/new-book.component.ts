import { Component, OnInit, OnDestroy } from '@angular/core';
import { Book } from 'src/app/models/book.model';
import { BookService } from '../book.service';
import { Subscription } from 'rxjs';
import { NgModel, NgForm, FormControl, Validators } from '@angular/forms';
import { HttpEventType } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { promise } from 'protractor';
import { resolve } from 'dns';
import { reject } from 'q';

@Component({
  selector: 'app-new-book',
  templateUrl: './new-book.component.html',
  styleUrls: ['./new-book.component.css']
})
export class NewBookComponent implements OnInit, OnDestroy {

books: Book[];
rang = [1, 2, 3];
selectedFile: File = null;  // fichier à uploader
progress: number ;
inProgress = false;
fileUrl: any;  // url du fichier apres upload
bookSubscription: Subscription;

  constructor(private bookService: BookService) { }

  ngOnInit() {
  }


  getIt(i: number) {
    console.log(i);
  }

  selectFile(event) {
    // Objet javascript qui represente le fichier à uploader
     this.fileUrl = '';
     this.selectedFile = event.target.files[0] as File;
     // console.log(this.selectedFile);
  }

  uploadFile(file: File, book: Book): string {
    // Implementation des champs des informations (champ [name]) à poster vers un serveur
    const fd = new FormData();
    fd.append('photo', file);  // definition du champ name='photo' dont la valeur est le fichier à uploader
    // fd.append('name', 'yoyo');  // definition du champ name='name' dont la valeur est 'yoyo'
    // console.log(this.selectedFile);
    this.progress = 0; this.inProgress = true;
    this.bookService.uploadFileToServerWithProgress(fd).subscribe(
      (event) => { console.log(event);
                   if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total) ;
          console.warn('Upload Progress :' + Math.round(100 * event.loaded / event.total) + '%');
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
          this.fileUrl = event.body;
        }
      },
      (error) => console.log(error),
      () => {
             this.inProgress = false;
             book.photo = this.fileUrl;
             console.log(book);
             // console.warn('fileUrl : ' + this.fileUrl);
             this.bookService.saveBookServer(book);
             console.warn('Upload Completed');
    // On recupere la liste des livres
             // this.bookService.bookSubject.subscribe((data: Book[]) => this.books = data);

      }
    );
    return this.fileUrl;
  }



  add(e: NgForm) {
    console.log('Checking Form Values');
    const formValues = e.value;
    console.log(formValues);
    console.log('Enregistrement du nouveau livre.');
    const title = formValues.title;

    let ControlFlag = false; // variable de controle des validation
    let control = new FormControl(formValues.title, [Validators.minLength(4), Validators.required]);
    if (control.errors) {
      console.log('Formulaire Invalid titre:' + control.errors);
      ControlFlag = true;
    }

    const author = formValues.author;
    control = new FormControl(formValues.author, [Validators.minLength(5), Validators.required]);
    if (control.errors) {
      console.log('Formulaire Invalid auteur:' + control.errors);
      ControlFlag = true;
    }

    // On definie le nouveau livre
    const book = new Book(title, author);
    // On upload d'abord afin de recuperer l'url du fichier uploadé
    if (!ControlFlag) {
      this.uploadFile(this.selectedFile, book) ;
    }
    // 
  }

  ngOnDestroy() {
    // this.bookSubscription.unsubscribe();
  }


  // How to implement promise
  /*
  uploadFile(file: File) {
      let element = new Promise((resolve, reject) => {
      this.bookService.uploadFileToServer(fd).toPromise()
      .then(
      response => { // success
        console.log('reponse : ' + response);
        // this.bookService.saveBookServer(book);
        resolve(response);  // si tout se passe bien, l'instruction resolve(response) transmet l'objet "response" dans element
    },
    error => {  // echec
      console.log(error);
      reject(error);
    }
    );
    });
    // return this.fileUrl;
  }*/

}
