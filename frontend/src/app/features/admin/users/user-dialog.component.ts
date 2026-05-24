import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models';

export interface DialogData {
  mode: 'create' | 'edit';
  user?: User;
}

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.scss'],
})
export class UserDialogComponent implements OnInit {
  form!: FormGroup;
  isLoading = false;
  showPassword = false;
  errorMessage = '';

  departments = ['Engineering', 'Marketing', 'HR', 'Finance', 'Legal', 'IT', 'Management', 'Customer Success', 'Design', 'General'];
  roles = ['General User', 'Admin'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [
        this.data.user?.username || '',
        [Validators.required, Validators.minLength(3)],
      ],
      email: [
        this.data.user?.email || '',
        [Validators.required, Validators.email],
      ],
      password: [
        '',
        this.data.mode === 'create'
          ? [Validators.required, Validators.minLength(6)]
          : [],
      ],
      role: [this.data.user?.role || 'General User', Validators.required],
      department: [this.data.user?.department || 'General', Validators.required],
    });
  }

  get isEdit(): boolean {
    return this.data.mode === 'edit';
  }

  get title(): string {
    return this.isEdit ? 'Edit User' : 'Create New User';
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.isLoading = true;
    this.errorMessage = '';

    const payload = this.form.value;

    const request$ = this.isEdit
      ? this.userService.updateUser(this.data.user!._id, payload)
      : this.userService.createUser(payload);

    request$.subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.dialogRef.close(true);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Operation failed. Please try again.';
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
