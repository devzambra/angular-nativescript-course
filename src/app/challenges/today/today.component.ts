import { DayStatus } from './../day.model';
import { Subscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { ChallengeService } from './../challenge.service';
import { Component, OnInit } from '@angular/core';
import { Day } from '../day.model';

@Component({
  selector: 'ns-today',
  templateUrl: './today.component.html',
  styleUrls: ['./today.component.scss'],
  moduleId: module.id,
})
export class TodayComponent implements OnInit, OnDestroy {

    currentDay: Day;
    currChallengeSub: Subscription;

  constructor(private _challengeService: ChallengeService) { }

  ngOnInit() {

    this.currChallengeSub = this._challengeService.currentChallenge.subscribe( currentChallenge => {
        if(currentChallenge) {
            this.currentDay = currentChallenge.currentDay;
        }
    });
  }

  ngOnDestroy() {
      if(this.currChallengeSub) {
          this.currChallengeSub.unsubscribe();
      }
  }

  onActionSelected(action: DayStatus) {
      this._challengeService.updateDayStatus(this.currentDay.dayInMonth, action);
  }

  getActionName() {
      if (this.currentDay.status === DayStatus.Completed) {
          return 'complete';
      }
    if (this.currentDay.status === DayStatus.Failed) {
        return 'fail';
    }
    return null;
  }

}
