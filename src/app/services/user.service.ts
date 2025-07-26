import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  preferences: UserPreferences;
  createdAt: string;
}

export interface Subscription {
  _id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  status: string;
  startDate: string;
  endDate: string;
}

export interface WatchHistory {
  _id: string;
  animeId: string;
  animeTitle: string;
  episodeNumber: number;
  progress: number; // percentage watched
  lastWatched: string;
}

export interface UserPreferences {
  language: string;
  quality: string;
  theme: string;
  subtitles: boolean;
  autoPlay: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private apiService: ApiService) {}

  getCurrentUser(): Observable<User> {
    return this.apiService.get<User>('/users/profile');
  }

  updateProfile(userData: Partial<User>): Observable<User> {
    return this.apiService.put<User>('/users/profile', userData);
  }

  getWatchHistory(): Observable<WatchHistory[]> {
    return this.apiService.get<WatchHistory[]>('/users/history');
  }

  addToHistory(animeId: string, episodeNumber: number, progress: number = 0): Observable<WatchHistory> {
    return this.apiService.post<WatchHistory>('/users/history', {
      animeId,
      episodeNumber,
      progress
    });
  }

  getSubscription(): Observable<Subscription | null> {
    return this.apiService.get<Subscription>('/users/subscription');
  }

  updateSubscription(subscriptionId: string): Observable<Subscription> {
    return this.apiService.post<Subscription>('/users/subscription', {
      subscriptionId
    });
  }

  getPreferences(): Observable<UserPreferences> {
    return this.apiService.get<UserPreferences>('/users/preferences');
  }

  updatePreferences(preferences: Partial<UserPreferences>): Observable<UserPreferences> {
    return this.apiService.put<UserPreferences>('/users/preferences', preferences);
  }

  toggleFavorite(animeId: string): Observable<{ message: string }> {
    return this.apiService.post<{ message: string }>('/users/favorites', { animeId });
  }

  getFavorites(): Observable<string[]> {
    return this.apiService.get<string[]>('/users/favorites');
  }
}
