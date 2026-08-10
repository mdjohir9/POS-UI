import { Component  } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { commonTaskService } from 'src/app/core/services/commonTaskService';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html'
})

export class SideNavComponent{

    public menuItems: any[]
    isFolded : boolean;
    isSideNavDark : boolean;
    isExpand : boolean;

    constructor( private themeService: ThemeConstantService, private commonService: commonTaskService ) {}

    ngOnInit(): void {
       this.menuItems = ROUTES.filter(menuItem => menuItem);
        this.getMenues();
       // this.commonService.getDynamicMenuApiCall();
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isExpandChanges.subscribe(isExpand => this.isExpand = isExpand);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    }
      
        getMenues(): void {
        
          this.commonService.getDynamicMenuApiCall().subscribe(
            (response: any) => {
    
              if (response?.statusCode === 200 && Array.isArray(response.data)) {
                console.log('API Response:', response.data);
                this.menuItems = [...response.data];
      
              } else {
                console.error('Error fetching data:', response.message);
                Swal.fire({
                  icon: 'warning',
                  title: 'Warning',
                  text: 'Failed to fetch data from API.',
                });
              }
            },
            (error) => {
              console.error('API Error:', error);
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'An unexpected error occurred.',
              });
            }
          );
        }
    
    ngAfterViewInit(): void{
        /* Collapsed Menu dropdown */
        let submenus = document.querySelectorAll('.ant-menu li.ant-menu-submenu');
        let direction = document.querySelector('html').getAttribute('dir');
        submenus.forEach(item => {
            item.addEventListener('mouseover', function () {
                let menuItem = this;
                let menuItemRect = menuItem.getBoundingClientRect();
                let submenuWrapper = menuItem.querySelector('.side-nav ul.ant-menu-sub');
                if (submenuWrapper) {
                    submenuWrapper.style.top = `${menuItemRect.top}px`;
                    if (direction === 'ltr') {
                        submenuWrapper.style.left = `${menuItemRect.left + Math.round(menuItem.offsetWidth * 0.75) + 10}px`;
                    } else if (direction === 'rtl') {
                        submenuWrapper.style.right = `${Math.round(menuItem.offsetWidth * 0.75) + 10}px`;
                    }
                  }
                
            })
        });
    }

    closeMobileMenu(): void {
        if (window.innerWidth < 992) {
            this.isFolded = false;
            this.isExpand = !this.isExpand;
            this.themeService.toggleExpand(this.isExpand);
            this.themeService.toggleFold(this.isFolded);
        }
    }
}
