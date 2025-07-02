import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatError, MatFormField, MatInput } from '@angular/material/input';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    MatButton,
    MatCard,
    MatError,
    MatFormField,
    MatInput,
    MatProgressSpinner,
    ReactiveFormsModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SignupComponent {
  isLoading = signal(false);

  onSignUp(loginForm: NgForm) {
    console.log(loginForm.value);
  }
}
