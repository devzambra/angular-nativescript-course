import { AuthGuard } from './auth/auth.guard';

import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';

const routes: Routes = [
    { path: 'auth', loadChildren: '~/app/auth/auth.module#AuthModule'},
    { path: 'challenges', loadChildren: '~/app/challenges/challenges.module#ChallengesModule', canLoad: [AuthGuard]},
    { path: '', redirectTo: '/challenges/tabs', pathMatch: 'full' },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule],
    providers: [AuthGuard]
})
export class AppRoutingModule {}
