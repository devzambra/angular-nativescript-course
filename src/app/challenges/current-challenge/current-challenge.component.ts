import { Day, DayStatus } from './../day.model';
import { OnDestroy } from '@angular/core';
import { ChallengeService } from './../challenge.service';
import { OnInit } from '@angular/core';
import { DayModalComponent } from './../day-modal/day-modal.component';
import { ModalDialogService } from 'nativescript-angular/modal-dialog';
import { Component, Input, ViewContainerRef } from '@angular/core';
import { UIService } from '~/app/shared/ui.service';
import { Challenge } from '../challenge.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ns-current-challenge',
    templateUrl: './current-challenge.component.html',
    styleUrls: [
        './_current-challenge.component.common.scss',
        './current-challenge.component.scss'
    ],
    moduleId: module.id
})
export class CurrentChallengeComponent implements OnInit, OnDestroy {

    weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    currentChallenge: Challenge;
    private currChallengeSub: Subscription;

    constructor(private modalDialog: ModalDialogService, private vcRef: ViewContainerRef, private _uiservice: UIService,
        private _challengeService: ChallengeService) {}

    onChangeStatus(day: Day) {

        if(!this.getIsSettable(day.dayInMonth)) {
            return;
        }
        this.modalDialog.showModal(DayModalComponent, {
            fullscreen: true,
            viewContainerRef: this._uiservice.getRootVCRef() ? this._uiservice.getRootVCRef() : this.vcRef,
            context: {
                date: day.date,
                status: day.status
            }
        })
        .then( (action: DayStatus) => {
            if (action === DayStatus.Open) {
                return;
            }
            this._challengeService.updateDayStatus(day.dayInMonth, action);
        });
    }

    ngOnInit() {
        this.currChallengeSub = this._challengeService.currentChallenge.subscribe( challenge => {
            this.currentChallenge = challenge;
        });
    }

    ngOnDestroy() {
        if(this.currChallengeSub) {
            this.currChallengeSub.unsubscribe();
        }
    }

    getRow(index: number, day: {dayInMonth: number, dayInWeek: number}) {
        const startRow = 1;
        const weekRow = Math.floor(index / 7);
        const firstWeekDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay();
        const irregularRow = day.dayInWeek < firstWeekDayOfMonth ? 1 : 0;

        return startRow + weekRow + irregularRow;
    }
    getIsSettable(dayInMonth: number) {
        return dayInMonth <= new Date().getDate();
    }

}
