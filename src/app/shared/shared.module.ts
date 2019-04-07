import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { ActionBarComponent } from './ui/action-bar/action-bar.component';
import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from 'nativescript-angular/common';

@NgModule({
    imports: [NativeScriptCommonModule, NativeScriptRouterModule],
    declarations: [ActionBarComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ],
    exports: [ActionBarComponent]
})
export class SharedModule {}
