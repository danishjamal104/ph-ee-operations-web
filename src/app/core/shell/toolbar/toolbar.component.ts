/** Angular Imports */
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { style, animate, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';

/** rxjs Imports */
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/** Custom Services */
import { AuthenticationService } from '../../authentication/authentication.service';

/**
 * Toolbar component.
 */
@Component({
  selector: 'mifosx-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(500, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ToolbarComponent implements OnInit {

  /** Subscription to breakpoint observer for handset. */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  /** Sets the initial visibility of search input as hidden. Visible if true. */
  searchVisible = false;
  /** Sets the initial state of sidenav as collapsed. Not collapsed if false. */
  sidenavCollapsed = true;

  /** Instance of sidenav. */
  @Input() sidenav: MatSidenav;
  /** Sidenav collapse event. */
  @Output() collapse = new EventEmitter<boolean>();

  /**
   * @param {BreakpointObserver} breakpointObserver Breakpoint observer to detect screen size.
   * @param {Router} router Router for navigation.
   * @param {AuthenticationService} authenticationService Authentication service.
   */
  constructor(private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authenticationService: AuthenticationService) { }

  /**
   * Subscribes to breakpoint for handset.
   */
  ngOnInit() {
    this.isHandset$.subscribe(isHandset => {
      if (isHandset && this.sidenavCollapsed) {
        this.toggleSidenavCollapse(false);
      }
    });
  }

  displayUser() {
    const credentials = this.authenticationService.getCredentials();
    return credentials ? credentials.username + ' - ' + credentials.tenantId : '';
  }

  /**
   * Toggles the current state of sidenav.
   */
  toggleSidenav() {
    this.sidenav.toggle();
  }

  /**
   * Toggles the current collapsed state of sidenav.
   */
  toggleSidenavCollapse(sidenavCollapsed?: boolean) {
    this.sidenavCollapsed = sidenavCollapsed || !this.sidenavCollapsed;
    this.collapse.emit(this.sidenavCollapsed);
  }

  /**
   * Toggles the visibility of search input with fadeInOut animation.
   */
  toggleSearchVisibility() {
    this.searchVisible = !this.searchVisible;
  }

  /**
   * Logs out the authenticated user and redirects to login page.
   */
  logout() {
    this.authenticationService.logout()
      .subscribe(() => this.router.navigate(['/login'], { replaceUrl: true }));
  }

}
