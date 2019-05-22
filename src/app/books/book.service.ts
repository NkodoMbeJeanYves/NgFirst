import { Injectable } from '@angular/core';
import { Book } from '../models/book.model';
import { Observable, Subject, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { catchError, retry } from 'rxjs/operators';
import { ToasterService } from '../services/toaster.service';

@Injectable({
  providedIn: 'root'
})
export class BookService {

  private books: Book[];
  url = 'http://eagerloading.test/api/';
   // web service
  /* definir les entetes et les options par defaut */
    /* Les entetes et options doivent être definies dans tous les services qui requierent des appels asynchrones */
    headers: Headers = new Headers();
    options: any;

    // on definie cette variable pour effectuer les mises à jour sur les components
   bookSubject = new Subject<Book[]>();



  constructor(private httpClient: HttpClient, private toastrService: ToasterService) {
    this.books = [];
    this.headers.append('enctype', 'multipart/form-data');
    this.headers.append('Content-Type', 'application/json');
    this.headers.append('X-requested-With', 'XMLHttpRequest');

    this.options = new HttpHeaders({
                                    'Content-Type':  'application/json',
                                    Authorization: 'my-auth-token',
                                    enctype: 'multipart/form-data',
                                    'X-Requested-With': 'XMLHttpRequest'
                                });
  }


  // Gestion des erreurs
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
      this.toastrService.Error(error.error.message, 'An error occured');
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
      this.toastrService.Error( 'Backend returned code :' + `${error.status}`, 'An error occured');
    }
    // return an observable with a user-facing error message
    this.toastrService.Error('Something bad happened; Make sure that you are connected to internet.');
    return throwError(
      'Something bad happened; Make sure that you are connected to internet.');

  }



  // Rechercher un livre à partir de son id dans la liste
  findBookbyId(id: number): Book {
    const searchBook = this.books.find(
      (objectBook) => {
        return objectBook.id === id ;
      }
    );
    return searchBook;
  }

  // Rechercher un livre à partir de son titre ou nom d'auteur
  getBookbyTitleOrAuthor(title?: string, author?: string): Book {
    const searchBook = this.books.find(
      (objectBook) => {
        return objectBook.title === title || objectBook.author === author ;
      }
    );
    return searchBook;
  }



  // cette méthode est à executer à chaque fois que la liste des livres est modifiée
    emitBookSubject() {
      this.books.map((book) => {
        const server = 'http://eagerloading.test';
        if (book.photo.substring(0, server.length ) !== server) {
            book.photo = server + book.photo;
          }
      } );
      this.bookSubject.next(this.books.slice());
      this.toastrService.Info('Book\'s list updated');
    }

    addBookToList(book: Book) {
        this.books.push(book);
      // cette méthode permet d'ajouter un element à la liste, par exemple lors 
      // d'une requete insert, on ajoute directement le nouvel objet à la liste au lieu de retelecharger 
      // une nouvelle liste depuis le serveur web
    }

    removeBookToList(book: Book) {
      const index = this.books.indexOf(book);
      this.books.splice(index, 1);
      // méthode permettant de supprimer un objet dans la liste,
      // par exemple lors de la requête de suppression
    }

    // Methode d'upload de fichier avec tracabilite de la progression
    uploadFileToServerWithProgress(formData: FormData) {
      const uploadUrl = 'http://eagerloading.test/api/upload';
      return this.httpClient.post(uploadUrl, formData,
        { //  Observer la progression de l'upload, pour transmettre un visuel ponctuel de l'upload
          reportProgress: true,
          observe: 'events'
        }
      );
      this.toastrService.Info('Upload of File completed');
    }

    // // Methode d'upload de fichier sans tracabilite de la progression  
    uploadFileToServerWithoutProgress(formData: FormData) {
      const uploadUrl = 'http://eagerloading.test/api/upload';
      this.toastrService.Info('Upload of File started');
      return this.httpClient.post(uploadUrl, formData );
    }

    // methode de recuperation des livres
    getBooksFromServer() {
      return this.httpClient.get<Book[]>(this.url + 'books')
      .pipe(
        retry(3),
        catchError(this.handleError)
      ).subscribe(
        (data) => {this.books = data; this.emitBookSubject();
                   this.toastrService.Info('Downloading books from server completed');
                  }, // this.emitBookSubject();
        (error) => {console.log(error);
                    this.toastrService.Error('An error occured while downloading your books. Please check your database connection.');
                  }
      );
    }

    // methode de recuperation des livres dont le titre ou l'auteur correspondrait à l'argument
    // parfaite méthode pour requête Ajax
    getBooksFromServerWithParam(arg: string) {
      if (arg === '') {
         arg = '@ll';
        }
      return this.httpClient.get<Book[]>(this.url + 'ajax/' + arg)
      .pipe(
        retry(3),
        catchError(this.handleError)
      ).subscribe(
        (data) => {this.books = data; this.emitBookSubject(); }, // this.emitBookSubject();
        (error) => console.log(error)
      );
    }

    /** POST: add a new book to the database */

    saveBookServer(objectBook: Book) {
      // Define a new book
      // const book = new Book('Avanger End Game', 'Stan Lee');
        console.log('Beginning ...');
        // La méthode post<IUsers> retourne un objet IUsers
        return this.httpClient.post<Book>(this.url + 'save', objectBook, this.options)
        .pipe(
          catchError(this.handleError)
        )
        .subscribe(
          (data: any) => {this.addBookToList(data);
                          this.emitBookSubject();
                          this.toastrService.Success('Success', 'You saved your book successfully');
                        }, // this.emitBookSubject();
          (error) => {console.log(error);
                      this.toastrService.Error(error); }
        );
    }

    UpdateBookServer(objectBook: Book) {
        return this.httpClient.put<Book>(this.url + 'update', objectBook, this.options)
        .pipe(
          catchError(this.handleError)
        );
    }

    /** DELETE: delete the book from the server */

    DeleteBookServer(objectBook: Book) {
        return this.httpClient.delete(this.url + 'delete/' + objectBook.id, this.options)
        .pipe(
          catchError(this.handleError)
        )
        .subscribe(
          (data) => {this.removeBookToList(objectBook);
                     this.toastrService.Warning('You deleted your book', 'Confirmation');
                     this.emitBookSubject(); console.log(data); }, // this.emitBookSubject();
          (error) => console.log(error)
        );
    }


}
