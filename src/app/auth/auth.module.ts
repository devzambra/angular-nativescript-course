import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { AuthComponent } from './auth.component';
import { SharedModule } from './../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NativeScriptFormsModule } from 'nativescript-angular/forms';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NgModule } from "@angular/core";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        NativeScriptRouterModule.forChild([
            {
                path: '',
                component: AuthComponent
            }
        ]),
        NativeScriptFormsModule,
        ReactiveFormsModule,
        SharedModule
    ],
    declarations: [AuthComponent]
})
export class AuthModule {

}
