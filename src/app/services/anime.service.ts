import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';

export interface Anime {
  _id: string;
  title: string;
  description: string;
  image: string;
  trailer: string;
  categories: string[];
  status: string;
  releaseYear: number;
  rating: number;
  seasons: Season[];
  createdAt: string;
}

export interface Season {
  _id?: string;
  seasonNumber: number;
  title: string;
  description: string;
  releaseDate: Date;
  poster: string;
  episodes: Episode[];
}

export interface Episode {
  _id?: string;
  episodeNumber: number;
  title: string;
  description: string;
  video: string;
  duration: string;
  thumbnail: string;
  releaseDate: Date;
}

export interface AnimeCategory {
  _id: string;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class AnimeService {
  constructor(private apiService: ApiService) {}

  getAllAnimes(): Observable<Anime[]> {
    return this.apiService.get<Anime[]>('/anime');
  }

  getAnimeById(id: string): Observable<Anime> {
    return this.apiService.get<Anime>(`/anime/${id}`);
  }

  getTrendingAnimes(): Observable<Anime[]> {
    return this.apiService.get<Anime[]>('/anime?trending=true');
  }

  getPopularAnimes(): Observable<Anime[]> {
    return this.apiService.get<Anime[]>('/anime?popular=true');
  }

  getNewReleases(): Observable<Anime[]> {
    return this.apiService.get<Anime[]>('/anime?new=true');
  }

  getAnimesByGenre(genre: string): Observable<Anime[]> {
    return this.apiService.get<Anime[]>(`/anime?category=${genre}`);
  }

  getSeasonsByAnimeId(animeId: string): Observable<Season[]> {
    return this.apiService.get<Season[]>(`/anime/${animeId}/seasons`);
  }

  getSeasonById(animeId: string, seasonNumber: number): Observable<Season> {
    return this.apiService.get<Season>(`/anime/${animeId}/seasons/${seasonNumber}`);
  }

  getEpisodesByAnimeId(animeId: string): Observable<Episode[]> {
    return this.apiService.get<Episode[]>(`/anime/${animeId}/episodes`);
  }

  getEpisodeById(animeId: string, seasonNumber: number, episodeNumber: number): Observable<Episode> {
    return this.apiService.get<Episode>(`/anime/${animeId}/seasons/${seasonNumber}/episodes/${episodeNumber}`);
  }

  // Legacy method for backward compatibility
  getEpisodeByIdLegacy(animeId: string, episodeId: string): Observable<Episode> {
    return this.apiService.get<Episode>(`/anime/${animeId}/episodes/${episodeId}`);
  }

  searchAnimes(query: string): Observable<Anime[]> {
    return this.apiService.get<Anime[]>(`/anime/search?q=${query}`);
  }

  getCategories(): Observable<AnimeCategory[]> {
    return this.apiService.get<AnimeCategory[]>('/anime/categories');
  }
}
