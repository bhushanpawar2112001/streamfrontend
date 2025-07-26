import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { AnimeDetailComponent } from './components/anime-detail/anime-detail.component';
import { LoginComponent } from './components/login/login.component';
import { AnimeService, Anime, Season, Episode } from './services/anime.service';
import { UserService, User, WatchHistory } from './services/user.service';
import { AuthService } from './services/auth.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, VideoPlayerComponent, UserProfileComponent, SubscriptionComponent, AnimeDetailComponent, LoginComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './netflix-style.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'streaming-platform';

  // Anime data
  animeList: Anime[] = [];
  trendingAnimes: Anime[] = [];
  popularAnimes: Anime[] = [];
  newReleases: Anime[] = [];
  categories: any[] = [];
  featuredAnime: Anime | null = null;

  // ViewChild references for horizontal scrolling
  @ViewChild('continueWatchingRow') continueWatchingRow!: ElementRef;
  @ViewChild('trendingRow') trendingRow!: ElementRef;
  @ViewChild('popularRow') popularRow!: ElementRef;
  @ViewChild('newReleasesRow') newReleasesRow!: ElementRef;

  // User data
  currentUser: any = null;
  watchHistory: WatchHistory[] = [];
  currentSubscription: any = null;
  isUserLoggedIn: boolean = false;

  // Video player
  showPlayer = false;
  currentVideoId = '';
  currentEpisode: Episode | null = null;
  currentSeason: Season | null = null;

  // Modals
  showUserProfile = false;
  showSubscription = false;
  showLogin = false;
  showLoginPrompt = false;
  showAnimeDetail = false;
  selectedAnime: Anime | null = null;

  constructor(
    private animeService: AnimeService,
    private userService: UserService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadAnimes();
    this.loadUserData();
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('storage', () => {
        this.loadUserData();
        this.cdr.detectChanges();
      });
    }
  }

  ngAfterViewInit() {
    // Netflix-style UI is ready
    console.log('Netflix-style UI initialized');
  }

  loadAnimes() {
    // Load all animes for Netflix-style UI
    this.animeService.getAllAnimes().subscribe(animes => {
      this.animeList = animes;
      // Set featured anime (first anime or random)
      if (animes.length > 0) {
        this.featuredAnime = animes[0];
      }
    });

    // Load trending animes
    this.animeService.getTrendingAnimes().subscribe(animes => {
      this.trendingAnimes = animes;
    });

    // Load popular animes
    this.animeService.getPopularAnimes().subscribe(animes => {
      this.popularAnimes = animes;
    });

    // Load new releases
    this.animeService.getNewReleases().subscribe(animes => {
      this.newReleases = animes;
    });

    // Load categories
    this.animeService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  loadUserData() {
    console.log('Loading user data...');
    // Check if user is logged in using AuthService
    const isLoggedIn = this.authService.isLoggedIn();
    this.isUserLoggedIn = isLoggedIn;
    
    if (isLoggedIn) {
      const user = this.authService.getUser();
      console.log('User from AuthService:', user);
      this.currentUser = user;
      if (this.currentUser) {
        console.log('User profile loaded:', this.currentUser);
        this.loadAuthenticatedUserData();
      }
    } else {
      console.log('User not logged in');
      this.currentUser = null;
    }
    
    console.log('Authentication state updated - isUserLoggedIn:', this.isUserLoggedIn);
  }

  loadAuthenticatedUserData() {
    // Only load these if user is authenticated
    this.userService.getWatchHistory().pipe(
      catchError(error => of([]))
    ).subscribe(history => {
      this.watchHistory = history;
    });

    this.userService.getSubscription().pipe(
      catchError(error => of(null))
    ).subscribe(subscription => {
      this.currentSubscription = subscription;
    });
  }

  playAnime(anime: Anime) {
    // Show anime detail modal instead of playing directly
    this.selectedAnime = anime;
    this.showAnimeDetail = true;
  }

  playEpisode(data: {anime: Anime, season: Season, episode: Episode}) {
    console.log('🎬 Episode clicked:', data.episode.title, 'Has video:', !!data.episode.video);
    
    // Note: Removed login requirement - episodes can play without authentication

    if (data.episode.video) {
      console.log('✅ Episode has video URL, starting playback...');
      console.log('📹 Playing episode:', data.episode.title);
      console.log('🔗 Video URL:', data.episode.video);
      
      // Set all the necessary data for video playback
      this.selectedAnime = data.anime;
      this.currentEpisode = data.episode;
      this.currentSeason = data.season;
      this.currentVideoId = data.episode.video;
      
      // Close anime detail modal and show video player
      this.showAnimeDetail = false;
      
      // Log current state before showing player
      console.log('📊 Current state before showing player:', {
        showPlayer: this.showPlayer,
        showAnimeDetail: this.showAnimeDetail,
        currentVideoId: this.currentVideoId,
        currentEpisode: this.currentEpisode,
        selectedAnime: this.selectedAnime?.title
      });
      
      // Small delay to ensure DOM updates
      setTimeout(() => {
        this.showPlayer = true;
        console.log('🎥 Video player should now be visible');
        console.log('📊 State after showing player:', {
          showPlayer: this.showPlayer,
          hasVideo: !!this.currentEpisode?.video,
          episodeTitle: this.currentEpisode?.title
        });
      }, 100);
      
      // Add to watch history (only if logged in)
      if (this.isLoggedIn()) {
        this.userService.addToHistory(data.anime._id, data.season.seasonNumber, data.episode.episodeNumber).subscribe({
          next: () => console.log('✅ Added to watch history'),
          error: (err) => console.error('❌ Failed to add to history:', err)
        });
      } else {
        console.log('ℹ️ Not logged in - skipping watch history update');
      }
    } else {
      console.error('❌ No video URL found for episode:', data.episode.title);
      console.log('🔍 Episode data:', data.episode);
      
      // Show user-friendly error message
      alert(`Sorry, this episode (${data.episode.title}) is not available for streaming yet.`);
    }
  }

  playTrailer(anime: Anime) {
    if (anime.trailer) {
      this.currentVideoId = anime.trailer;
      this.currentEpisode = null;
      this.currentSeason = null;
      this.showPlayer = true;
      this.showAnimeDetail = false;
    }
  }

  playFromHistory(history: WatchHistory) {
    this.currentVideoId = history.animeId;
    this.showPlayer = true;
  }

  closePlayer() {
    this.showPlayer = false;
    this.currentVideoId = '';
    this.currentEpisode = null;
    this.currentSeason = null;
  }

  closeAnimeDetail() {
    this.showAnimeDetail = false;
    this.selectedAnime = null;
  }

  closeLoginPrompt() {
    this.showLoginPrompt = false;
  }

  redirectToLogin() {
    // Implement login redirect logic here
    alert('Redirecting to login page...');
    this.showLoginPrompt = false;
  }

  loginWithGoogle() {
    // Redirect to backend Google OAuth endpoint
    window.location.href = 'http://localhost:3000/auth/google';
  }

  // User Profile Methods
  isLoggedIn(): boolean {
    const loggedIn = this.authService.isLoggedIn();
    console.log('isLoggedIn() called - AuthService says:', loggedIn);
    return loggedIn;
  }

  getUserInitials(): string {
    if (this.currentUser?.name) {
      const names = this.currentUser.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (this.currentUser?.email) {
      return this.currentUser.email[0].toUpperCase();
    }
    return 'U';
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    // Reload the page to reset the state
    window.location.reload();
  }

  onLoginSuccess(response: any) {
    console.log('Login success, response:', response);
    
    // The response should contain both user and token
    if (response && response.user) {
      this.currentUser = response.user;
      console.log('User set from response:', this.currentUser);
    }
    
    this.showLogin = false;
    
    // Immediately set the authentication state
    this.isUserLoggedIn = true;
    
    // Force reload user data from AuthService after a short delay
    // This ensures localStorage has been updated
    setTimeout(() => {
      this.loadUserData();
      console.log('Auth state after timeout - Logged in:', this.authService.isLoggedIn());
      console.log('User from AuthService:', this.authService.getUser());
      console.log('Current user in component:', this.currentUser);
      console.log('isUserLoggedIn property:', this.isUserLoggedIn);
      
      // Force change detection to update the UI
      this.cdr.detectChanges();
    }, 100);
  }

  // Netflix-style UI Methods
  selectAnime(anime: Anime) {
    this.selectedAnime = anime;
    this.showAnimeDetail = true;
  }

  scrollRow(rowId: string, direction: 'left' | 'right') {
    if (!isPlatformBrowser(this.platformId)) return;
    
    const element = this.getRowElement(rowId);
    if (!element) return;
    
    const scrollAmount = 300; // Width of one card plus gap
    const currentScroll = element.scrollLeft;
    
    if (direction === 'left') {
      element.scrollTo({
        left: currentScroll - scrollAmount,
        behavior: 'smooth'
      });
    } else {
      element.scrollTo({
        left: currentScroll + scrollAmount,
        behavior: 'smooth'
      });
    }
  }

  private getRowElement(rowId: string): HTMLElement | null {
    switch (rowId) {
      case 'continueWatchingRow':
        return this.continueWatchingRow?.nativeElement;
      case 'trendingRow':
        return this.trendingRow?.nativeElement;
      case 'popularRow':
        return this.popularRow?.nativeElement;
      case 'newReleasesRow':
        return this.newReleasesRow?.nativeElement;
      default:
        return null;
    }
  }
}
