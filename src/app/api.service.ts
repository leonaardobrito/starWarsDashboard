import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { People, Planet } from './api.models';

@Injectable()
export class ConfigService {
    TAG = 'Swapi Service : ';
    swapiUrl = 'https://swapi.co/api/';

    constructor(private http: HttpClient) { }

    /**
     * Add page value url param
     */
    getByPage(page: number): string {
        if (page) { return '&page=' + page; } else { return ''; }
    }

    /**
    * Return list of people as observable
    */
    getPeople(page?: number): Observable<People[]> {
        return this.http.get<People[]>(`${this.swapiUrl}people?format=json${this.getByPage(page)}`)
            .pipe(
                map(resp => resp['results']),
                catchError(this.handleError)
            );
    }


    /**
     * Return people by id
     */
    getPeopleById(id: number): Observable<People> {
        return this.http.get<People>(`${this.swapiUrl}people/${id}?format=json`)
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
    * Search people by name
    */
    searchPeople(name: string): Observable<People[]> {
        return this.http.get<People[]>(`${this.swapiUrl}people?search=${name}`)
            .pipe(
                map(resp => resp['results']),
                catchError(this.handleError)
            );
    }

    /**
    * Return planet by id
    */
    getPlanet(id: string): Observable<Planet> {
        return this.http.get<Planet>(`${this.swapiUrl}planets/${id}?format=json`)
            .pipe(
                catchError(this.handleError)
            );
    }

    /**
    * Handle HTTP Errors
    */
    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error(`${this.TAG} An error occurred:`, error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error(
                `${this.TAG} Backend returned code ${error.status}, ` +
                `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
            `${this.TAG} Something bad happened; please try again later.`);
    }
}