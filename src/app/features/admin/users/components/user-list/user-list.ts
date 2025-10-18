import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../user.service';
import { User } from '../../user.model';
import { UserForm } from '../user-form/user-form';
import { ToastService } from '../../../../../core/services/toast.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, UserForm],
  templateUrl: './user-list.html',
})
export class UserList implements OnInit {
  users: User[] = [];
  loading = true;
  selectedUser?: User;
  showForm = false;

  constructor(private service: UserService, private toast: ToastService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.service.getAll().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  openForm(user?: User) {
    this.selectedUser = user;
    this.showForm = true;
  }

  //  Dynamically handle add / edit

  closeForm(event?: { updated?: boolean; user?: User }) {
    this.showForm = false;
    if (!event?.updated) return;

    if (this.selectedUser) {
      // Update existing
      const index = this.users.findIndex((b) => b.id === this.selectedUser!.id);
      if (index !== -1 && event.user) this.users[index] = event.user;
    } else if (event.user) {
      // Add new
      this.users.unshift(event.user);
    }

    this.selectedUser = undefined;
  }

  //  Delete dynamically
  delete(id: string) {
    if (!confirm('Delete this user?')) return;
    this.service.delete(id).subscribe({
      next: () => {
        this.users = this.users.filter((b) => b.id !== id);
        this.toast.show('User deleted successfully', 'success');
      },
      error: () => this.toast.show('Failed to delete user', 'error'),
    });
  }
}
