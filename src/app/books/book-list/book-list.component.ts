import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { BookService} from '../book.service';
import { Book } from 'src/app/models/book.model';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
// apply EndPoint Api
// Link : https://angular.io/guide/practical-observable-usage
import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, filter, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { forEach } from '@angular/router/src/utils/collection';
import { NgModel } from '@angular/forms';
import { ToasterService } from 'src/app/services/toaster.service';

@Injectable()
@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit, OnDestroy {

  books: Book[];
  ajaxBooks: Book[];
  bookSubscription: Subscription;
  inputText: string;
  searchBox: string;

  constructor(private bookService: BookService, private router: Router, private toastrService: ToasterService) { }

  ngOnInit() {
    this.toastrService.Info('Please wait', 'We are retrieve your books');
    this.loadBooksFromServer();
    // grace à cette ligne, on accède à la copie du tableau de livre via la methode next dans la classe BookService
    this.retrieveUpdatedBooksList();
  }

  // Mettre à jour la liste des livres depuis le service BookService
  retrieveUpdatedBooksList() {
    this.bookSubscription = this.bookService.bookSubject.subscribe(
      (books: Book[]) => {
        this.books = books;
        console.log(this.books);
        this.toastrService.Info('Download of books Completed');
      }
    );
  }

  deleteMe(idBook) {
    console.log('You deleted item #' + idBook);
    const book = this.bookService.findBookbyId(idBook);
    this.bookService.DeleteBookServer(book);
    this.retrieveUpdatedBooksList();
  }

  onInput(k: NgModel) {
    // console.log('onInput : ' + k.control.value);
    this.inputText = k.control.value;
    this.books = [];
    // On ecoute les input sur la zone de texte
    // this.inputMapper(this.inputText);
    this.bookService.getBooksFromServerWithParam(this.inputText);
    // grace à cette ligne, on accède à la copie du tableau de livre via la methode next dans la classe BookService
    this.retrieveUpdatedBooksList();
  }


  // Ecouter l'evenement input sur la zone de texte search-box pour appliquer une requete ajax
  inputMapper(searchKey) {
    console.log( 'inputMapper');
    const searchBox = document.getElementById('search-box');
    const learnInput$ = fromEvent(searchBox, 'input')
      .pipe(
      map((e: KeyboardEvent) => e.target),
      // filter(value => value !== '' ), // la requete s'execute si il y a plus de 2 caractères tapés au clavier
      debounceTime(10),
      distinctUntilChanged(),
      switchMap(() => ajax('http://eagerloading.test/api/ajax/' + searchKey))
      // { id: 522, name: "Mr. Garret Johnson II", email: "nblick@example.com" }
    );
    // Begin listening
    const subscription = learnInput$
      .subscribe(e => {
        e.response.forEach(element => {
        console.log('title :' + element.title + ', id :' + element.id, 'author : ' + element.author + ',KeyWord : ' + this.inputText);
        this.books.push(element);
        }
        );
      });
    // Stop listening
    subscription.unsubscribe();
  }

  // on recharge la liste des livres
  loadBooksFromServer() {
    this.bookService.getBooksFromServer();
  }

  ngOnDestroy() {
    // on libere les ressources
    this.bookSubscription.unsubscribe();
  }

}
