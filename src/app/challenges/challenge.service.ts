import { OnDestroy } from '@angular/core';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { take, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Challenge } from './challenge.model';
import { DayStatus, Day } from './day.model';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({providedIn: 'root'})
export class ChallengeService implements OnDestroy {

    private _currentChallenge = new BehaviorSubject<Challenge>(null);
    private userSub: Subscription;

    constructor(private http: HttpClient, private auth: AuthService) {
        this.userSub = this.auth.user.subscribe( user => {
            if(!user) {
                this._currentChallenge.next(null);
            }
        });
    }

    ngOnDestroy() {
        this.userSub.unsubscribe()
    }

    get currentChallenge() {
        return this._currentChallenge.asObservable();
    }

    fetchCurrentChallenge() {
        return this.auth.user.pipe(
            take(1),
            switchMap( currentUser => {
            if(!currentUser || !currentUser.isAuth) {
                return of(null);
            }
            return this.http.get<{
                title: string,
                description: string,
                month: number,
                year: number,
                _days: Day[]
            }>(`https://ns-ng-course-6db9e.firebaseio.com/challenge${currentUser.id}.json?auth=${currentUser.token}`)
        }),
        tap(resData => {
            if(resData) {
                const loadedChallenge = new Challenge(resData.title, resData.description, resData.year, resData.month, resData._days);

                this._currentChallenge.next(loadedChallenge);
            }
        }));
    }

    createNewChallenge(title: string, description: string) {
        const newChallenge = new Challenge(title, description, new Date().getFullYear(), new Date().getMonth());

        this._currentChallenge.next(newChallenge);
        this.saveToServer(newChallenge);
    }
    private saveToServer(challenge: Challenge) {
        this.auth.user.pipe(
            take(1),
            switchMap( currentUser => {
            if(!currentUser || !currentUser.isAuth) {
                return of(null);
            }
            return this.http.put(`https://ns-ng-course-6db9e.firebaseio.com/challenge${currentUser.id}.json?auth=${currentUser.token}`, challenge);
        })).subscribe();
    }
    updateDayStatus(dayInMonth: number, status: DayStatus) {
        this._currentChallenge.pipe(take(1)).subscribe( challenge => {
            if(!challenge || challenge.days.length < dayInMonth) {
                return;
            }

            const dayIndex = challenge.days.findIndex(d => d.dayInMonth === dayInMonth);

            challenge.days[dayIndex].status = status;

            this._currentChallenge.next(challenge);
            this.saveToServer(challenge);
        });
    }
    updateChallenge(title: string, description: string) {
        this.currentChallenge.pipe(take(1)).subscribe(challenge => {
            const updatedChallenge = new Challenge(
                title,
                description,
                challenge.year,
                challenge.month,
                challenge.days
            );
            this._currentChallenge.next(updatedChallenge);
            this.saveToServer(updatedChallenge);
        });
    }
}
