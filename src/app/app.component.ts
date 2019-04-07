import { UIService } from './shared/ui.service';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewContainerRef } from "@angular/core";
import { Subscription } from 'rxjs';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { AuthService } from './auth/auth.service';

@Component({
    selector: "ns-app",
    moduleId: module.id,
    templateUrl: "./app.component.html"
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit{

    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;

    activeChallenge = '';
    private drawerSub: Subscription;
    private drawer: RadSideDrawer;

    constructor(private uiservice: UIService, private changeDetectionRef: ChangeDetectorRef, private vcRef: ViewContainerRef,
        private auth: AuthService) {}

    ngOnInit() {
        this.drawerSub = this.uiservice.drawerState.subscribe(() => {
           if(this.drawer) {
            this.drawer.toggleDrawerState();
           }
        });
        this.uiservice.setRootViewRef(this.vcRef);
    }

    onChallengeInput(challengeDescription: string) {
        this.activeChallenge = challengeDescription;
    }

    ngOnDestroy() {
        if(this.drawerSub) {
            this.drawerSub.unsubscribe();
        }
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this.changeDetectionRef.detectChanges();
    }
    onLogout() {
        this.auth.logout();
        this.uiservice.toggleDrawer();
    }

}
