import { RouterExtensions } from 'nativescript-angular/router';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { ChallengeService } from '../challenge.service';
import { isAndroid } from 'tns-core-modules/platform';

@Component({
  selector: 'ns-challenge-tabs',
  templateUrl: './challenge-tabs.component.html',
  styleUrls: [
    './challenge-tabs.component.common.css',
    './challenge-tabs.component.css'
    ],
  moduleId: module.id,
})
export class ChallengeTabsComponent implements OnInit {

    isLoading = false;

  constructor(private router: RouterExtensions, private active: ActivatedRoute, private page: Page,
    private _challengeService: ChallengeService) { }
    get android() {
        return isAndroid;
    }
  ngOnInit() {
    this.isLoading = true;

    this._challengeService.fetchCurrentChallenge().subscribe(res => {
        this.loadTabRoutes();
        this.isLoading = false;
    }, err => {
        this.loadTabRoutes();
        this.isLoading = false;
    });

    this.page.actionBarHidden = true;
  }

  loadTabRoutes() {
        if(isAndroid) {
            setTimeout(() => {
                this.router.navigate([{outlets: {currentChallenge: ['current-challenge'], today: ['today']}}], {relativeTo: this.active});
            }, 10);
        } else {
            this.router.navigate([{outlets: {currentChallenge: ['current-challenge'], today: ['today']}}], {relativeTo: this.active});
        }

  }

}
