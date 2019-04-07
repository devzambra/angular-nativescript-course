import { SharedModule } from './../shared/shared.module';
import { TodayComponent } from './today/today.component';
import { ChallengeTabsComponent } from './challenge-tabs/challenge-tabs.component';
import { CurrentChallengeComponent } from './current-challenge/current-challenge.component';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ChallengesRoutingModule } from "./challenges-routing.module";
import { ChallengeActionsModule } from './challenge-actions/challenge-actions.module';

@NgModule({
    declarations: [
        CurrentChallengeComponent,
        ChallengeTabsComponent,
        TodayComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    imports: [
        NativeScriptCommonModule,
        ChallengesRoutingModule,
        SharedModule,
        ChallengeActionsModule
    ]
})
export class ChallengesModule {}
