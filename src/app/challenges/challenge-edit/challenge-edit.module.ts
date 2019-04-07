import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { SharedModule } from './../../shared/shared.module';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ChallengeEditComponent } from './challenge-edit.component';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        SharedModule,
        NativeScriptRouterModule,
        NativeScriptFormsModule,
        NativeScriptRouterModule.forChild([{path: '', component: ChallengeEditComponent}])
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    declarations: [
        ChallengeEditComponent
    ]
})
export class ChallengeEditModule {}
