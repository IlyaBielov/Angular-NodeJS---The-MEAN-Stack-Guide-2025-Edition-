import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: 'header.component.css',
  imports: [
    MatToolbar,
    RouterLink,
    MatButton,
    RouterLinkActive
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);

  isAuthenticated = signal(false);

  ngOnInit() {
    this.isAuthenticated.set(this.authService.getIsAuth());
    this.authService.getAuthStatusListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(isAuthenticated => {
        this.isAuthenticated.set(isAuthenticated);
      })
  }

  onLogout() {
    this.authService.logout();
  }
}
