import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, WatchHistory } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  @Input() user: User | null = null;
  @Input() watchHistory: WatchHistory[] = [];
  @Output() close = new EventEmitter<void>();
  editMode = false;

  onClose() {
    this.close.emit();
  }

  saveProfile() {
    // Implement save logic here
    this.editMode = false;
  }

  cancelEdit() {
    this.editMode = false;
  }
}
