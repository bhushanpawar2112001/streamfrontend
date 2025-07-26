import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Anime, Season, Episode } from '../../services/anime.service';

@Component({
  selector: 'app-anime-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './anime-detail.component.html',
  styleUrl: './anime-detail.component.css'
})
export class AnimeDetailComponent implements OnInit {
  @Input() anime: Anime | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() playEpisode = new EventEmitter<{anime: Anime, season: Season, episode: Episode}>();
  @Output() playTrailer = new EventEmitter<Anime>();

  selectedSeason: Season | null = null;
  selectedSeasonIndex: number = 0;

  ngOnInit() {
    if (this.anime && this.anime.seasons && this.anime.seasons.length > 0) {
      this.selectedSeason = this.anime.seasons[0];
      this.selectedSeasonIndex = 0;
    }
  }

  ngOnChanges() {
    if (this.anime && this.anime.seasons && this.anime.seasons.length > 0) {
      this.selectedSeason = this.anime.seasons[0];
      this.selectedSeasonIndex = 0;
    }
  }

  selectSeason(season: Season, index: number) {
    this.selectedSeason = season;
    this.selectedSeasonIndex = index;
  }

  onPlayEpisode(episode: Episode) {
    console.log('🎬 Episode clicked:', {
      episodeTitle: episode.title,
      episodeNumber: episode.episodeNumber,
      hasVideo: !!episode.video,
      videoUrl: episode.video,
      anime: this.anime?.title,
      season: this.selectedSeason?.title
    });

    if (!this.anime) {
      console.error('❌ Cannot play episode: No anime data');
      return;
    }

    if (!this.selectedSeason) {
      console.error('❌ Cannot play episode: No season selected');
      return;
    }

    if (!episode.video) {
      console.warn('⚠️ Episode has no video URL:', episode.title);
      alert(`Episode "${episode.title}" is not available for streaming yet.`);
      return;
    }

    console.log('✅ Emitting playEpisode event...');
    this.playEpisode.emit({
      anime: this.anime,
      season: this.selectedSeason,
      episode: episode
    });
  }

  onPlayTrailer() {
    if (this.anime) {
      this.playTrailer.emit(this.anime);
    }
  }

  onClose() {
    this.close.emit();
  }

  formatDuration(duration: string): string {
    return duration || '24:00';
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString();
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-green-600';
      case 'ongoing':
        return 'bg-blue-600';
      case 'upcoming':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  }
}
