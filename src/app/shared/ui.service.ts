import { Injectable, ViewContainerRef } from "@angular/core";
import { BehaviorSubject } from 'rxjs';


@Injectable({providedIn: 'root'})
export class UIService {
    private _drawerState = new BehaviorSubject<void>(null);
    private _rootVcRef: ViewContainerRef;

    get drawerState() {
        return this._drawerState.asObservable();
    }

    toggleDrawer() {
        this._drawerState.next(null);
    }

    setRootViewRef(vcRef: ViewContainerRef) {
        this._rootVcRef = vcRef;
    }

    getRootVCRef() {
        return this._rootVcRef;
    }
}
