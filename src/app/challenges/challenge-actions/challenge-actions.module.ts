import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChallengeActionsComponent } from './challenge-actions.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports: [NativeScriptCommonModule],
    declarations: [ChallengeActionsComponent],
    exports: [ChallengeActionsComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ChallengeActionsModule {}
