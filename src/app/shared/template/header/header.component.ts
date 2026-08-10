import { Component } from '@angular/core';
import { ThemeConstantService } from '../../services/theme-constant.service';
import messages from '../../../../assets/data/global/header/messages.json';
import notification from '../../../../assets/data/global/header/notification.json';
import authorMenu from '../../../../assets/data/global/header/author-menu.json';
import settings from '../../../../assets/data/global/header/settings.json';
import { AuthService } from 'src/app/core/services/auth.service';
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent{

    searchVisible : boolean = false;
    quickViewVisible : boolean = false;
    isFolded : boolean;
    isExpand : boolean;
    appMessages = messages.appMessages;
    appNotification = notification.appNotification;
    appAuthorMenu = authorMenu.appAuthorMenu;
    appSettings = settings.appSettings;
    userName: string | null = '';

    constructor( private themeService: ThemeConstantService, private auth:AuthService) {}

    signOut(): void {
      this.auth.logout();
    }

    ngOnInit(): void {
        this.userName = sessionStorage.getItem('__userName__');
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
    }

    toggleFold() {
        this.isFolded = !this.isFolded;
        this.themeService.toggleFold(this.isFolded);
    }

    toggleExpand() {
        this.isFolded = false;
        this.isExpand = !this.isExpand;
        this.themeService.toggleExpand(this.isExpand);
        this.themeService.toggleFold(this.isFolded);
    }

    searchToggle(): void {
        this.searchVisible = !this.searchVisible;
    }

    quickViewToggle(): void {
        this.quickViewVisible = !this.quickViewVisible;
    }
}
