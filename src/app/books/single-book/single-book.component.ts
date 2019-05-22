import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Routes, Router } from '@angular/router';
import { BookService } from '../book.service';
import { Book } from 'src/app/models/book.model';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { reject } from 'q';

@Component({
  selector: 'app-single-book',
  templateUrl: './single-book.component.html',
  styleUrls: ['./single-book.component.css']
})
export class SingleBookComponent implements OnInit {

  private title: string;
  private author: string;
  private photo: string;
  private ind: number;
  fileUrl: any;
  selectedFile: File = null;
  books: Book[];

  constructor(private route: ActivatedRoute, private bookService: BookService, private router: Router) { }

  ngOnInit() {
    const index = +this.route.snapshot.params.id;
    const book = this.bookService.findBookbyId(index);
    this.title = book.title;
    this.author = book.author;
    this.photo = book.photo;
    this.ind = +index;
    console.log('book :' + book);
  }
  // evenement [change] sur le bouton upload
  selectFile(event) {
    // Objet javascript qui represente le fichier à uploader
     this.fileUrl = '';
     this.selectedFile = event.target.files[0] as File;
     // console.log(this.selectedFile);
  }


  uploadFile(file: File, book: Book): string {
    // Implementation des champs des informations (champ [name]) à poster vers un serveur
    const fd = new FormData();
    const IdBookForUpdate = book.id.toString();
    fd.append('photo', file);  // definition du champ name='photo' dont la valeur est le fichier à uploader
    fd.append('idBook', IdBookForUpdate); // definition de l'id du livre dont le fichier devra être supprimer avant 
    // fd.append('name', 'yoyo');  // definition du champ name='name' dont la valeur est 'yoyo'
    // console.log(this.selectedFile);
    // this.progress = 0; this.inProgress = true;
    this.bookService.uploadFileToServerWithoutProgress(fd).subscribe(
      (data: any) => { console.log('DataOut : ' + data);
                       this.fileUrl = data;
      },
      (error) => console.log(error),
      () => {
             book.photo = this.fileUrl;
             console.log(book);
             // console.warn('fileUrl : ' + this.fileUrl);
             this.updateBookAfterUpload(book);
             console.warn('Upload Completed');
    // On recupere la liste des livres
             // this.bookService.bookSubject.subscribe((data: Book[]) => this.books = data);

      }
    );
    return this.fileUrl;
  }

  updateBook(form: NgForm) {
    console.log('Form Values :' + form.value);
    const item = form.value;
    const book = new Book(item.title, item.author);
    book.id = this.ind;
    // On reinitialise les valeurs du formulaire
    form.reset();
    console.log(book);
    // On upload le fichier accompagne du livre en question
    this.uploadFile(this.selectedFile, book);
    /*let promise = new Promise((resolve, reject) => {
      this.bookService.UpdateBookServer(book).toPromise()
    .then(
      (data: any) => {
        console.log('Object Updated : ' + data.title);
        this.title = data.title;
        this.author = data.author;
        this.photo = data.photo;
        resolve(data);
      }, error => {
        reject(error);
      }
    );
    });*/


    /*this.bookService.UpdateBookServer(book).toPromise()
    .then(
      data => {
        console.log(data);
      }, error => {
        reject(error);
      }
    );*/
    /*.subscribe(
      (data: any) => {
          this.title = data.title;
          this.author = data.author;
          this.photo = data.photo;
          // this.router.navigate(['/book/show/' + this.ind]);
          console.log('done');
       },
      (error) => console.log(error)
    );*/
  }

  updateBookAfterUpload(book: Book) {
    const promise = new Promise((resolve, reject) => {
      this.bookService.UpdateBookServer(book).toPromise()
    .then(
      (data: any) => {
        console.log('Object Updated : ' + data);
        this.title = data.title;
        this.author = data.author;
        // Vu que on ne recharge pas depuis la liste, on modifie le chemin vers la photo pour affichage dans le navigateur
        this.photo = 'http://eagerloading.test' + data.photo;
        resolve(data);
      }, error => {
        reject(error);
      }
    );
    });

  }


}
