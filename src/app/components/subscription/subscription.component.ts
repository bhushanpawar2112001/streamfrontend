import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from '../../services/user.service';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {
  @Input() subscription: any;
  @Output() close = new EventEmitter<void>();

  subscriptionPlans = [
    { id: 'basic', name: 'Basic', price: 7.99, duration: 1, features: ['HD Streaming', 'Ad-supported', 'Single device'], popular: false },
    { id: 'premium', name: 'Premium', price: 11.99, duration: 1, features: ['HD Streaming', 'Ad-free', 'Multiple devices', 'Offline downloads'], popular: true },
    { id: 'ultimate', name: 'Ultimate', price: 15.99, duration: 1, features: ['4K Streaming', 'Ad-free', 'Multiple devices', 'Offline downloads', 'Exclusive content'], popular: false }
  ];

  allFeatures = [
    'HD Streaming',
    'Ad-supported',
    'Single device',
    'Ad-free',
    'Multiple devices',
    'Offline downloads',
    '4K Streaming',
    'Exclusive content'
  ];

  upgradePlan(plan: any) {
    // Implement upgrade logic here
    alert('Upgrade to: ' + plan.name);
  }

  cancelSubscription() {
    // Implement cancel logic here
    alert('Subscription cancelled');
  }

  onClose() {
    this.close.emit();
  }
}
