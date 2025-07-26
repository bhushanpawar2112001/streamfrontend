import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ElementRef, ViewChild, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

@Component({
  selector: 'app-video-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './video-player.component.html',
  styleUrl: './video-player.component.css'
})
export class VideoPlayerComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() videoUrl: string = '';
  @Input() posterUrl: string = '';
  @Input() title: string = '';
  @Input() videoId: string = 'video-player';
  @Input() showPlayer: boolean = false;
  @Output() closePlayer = new EventEmitter<void>();

  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;

  private player: any;
  private isPlayerInitialized = false;

  ngOnInit() {
    console.log('🎬 VideoPlayer ngOnInit - showPlayer:', this.showPlayer, 'videoUrl:', this.videoUrl);
  }

  ngAfterViewInit() {
    console.log('🎬 VideoPlayer ngAfterViewInit - showPlayer:', this.showPlayer, 'videoUrl:', this.videoUrl);
    if (this.showPlayer && this.videoUrl && !this.isPlayerInitialized) {
      setTimeout(() => {
        this.initializePlayer();
      }, 100);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('🎬 VideoPlayer ngOnChanges - showPlayer:', this.showPlayer, 'videoUrl:', this.videoUrl);
    console.log('🔄 Changes:', changes);
    
    // If showPlayer changed to true and we have a video URL
    if (changes['showPlayer'] && this.showPlayer && this.videoUrl && this.videoElement) {
      console.log('📺 ShowPlayer changed to true, initializing player...');
      setTimeout(() => {
        this.initializePlayer();
      }, 200);
    }
    
    // If videoUrl changed and player is visible
    if (changes['videoUrl'] && this.showPlayer && this.videoUrl && this.videoElement) {
      console.log('🔗 Video URL changed, reinitializing player...');
      this.destroyPlayer();
      setTimeout(() => {
        this.initializePlayer();
      }, 200);
    }
    
    // If showPlayer changed to false
    if (changes['showPlayer'] && !this.showPlayer && this.player) {
      console.log('❌ ShowPlayer changed to false, destroying player...');
      this.destroyPlayer();
    }
  }

  ngOnDestroy() {
    this.destroyPlayer();
  }

  private destroyPlayer() {
    if (this.player) {
      console.log('🗑️ Destroying video player');
      try {
        this.player.dispose();
        this.player = null;
        this.isPlayerInitialized = false;
      } catch (error) {
        console.error('❌ Error destroying player:', error);
        this.player = null;
        this.isPlayerInitialized = false;
      }
    }
  }

  initializePlayer() {
    if (this.isPlayerInitialized) {
      console.log('⚠️ Player already initialized, skipping...');
      return;
    }

    console.log('🎬 Initializing video player with:', {
      videoId: this.videoId,
      hasVideoUrl: !!this.videoUrl,
      hasPosterUrl: !!this.posterUrl,
      hasVideoElement: !!this.videoElement
    });

    if (!this.videoUrl) {
      console.error('❌ Cannot initialize player: No video URL provided');
      return;
    }

    if (!this.videoElement) {
      console.error('❌ Cannot initialize player: Video element not available');
      return;
    }

    try {
      // Destroy existing player if it exists
      if (this.player) {
        console.log('🗑️ Destroying existing player');
        this.destroyPlayer();
      }

      console.log('✅ Video element found, initializing Video.js...');

      // Initialize Video.js player using the ViewChild element
      this.player = videojs(this.videoElement.nativeElement, {
        controls: true,
        responsive: true,
        fluid: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2],
        poster: this.posterUrl,
        sources: [{
          src: this.videoUrl,
          type: 'video/mp4'
        }],
        // Security settings
        html5: {
          nativeControlsForTouch: false
        },
        // Disable right-click context menu
        contextMenu: false,
        // Disable download button
        controlBar: {
          downloadButton: false
        }
      });

      this.isPlayerInitialized = true;

      // Add event listeners
      this.player.on('ready', () => {
        console.log('✅ Video player is ready');
        
        // Additional security measures
        this.addSecurityMeasures();
      });

      this.player.on('error', (error: any) => {
        console.error('❌ Video player error occurred');
      });

      this.player.on('loadstart', () => {
        console.log('📡 Video loading started');
      });

      this.player.on('canplay', () => {
        console.log('▶️ Video can start playing');
      });

      console.log('✅ Video player initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize video player:', error);
      this.isPlayerInitialized = false;
    }
  }

  onClosePlayer() {
    if (this.player) {
      this.player.pause();
    }
    this.closePlayer.emit();
  }

  private addSecurityMeasures() {
    if (this.player && this.videoElement) {
      // Disable right-click context menu on video element
      const videoEl = this.videoElement.nativeElement;
      videoEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Disable drag and drop
      videoEl.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
      });
      
      // Disable text selection
      videoEl.style.userSelect = 'none';
      videoEl.style.webkitUserSelect = 'none';
      
      // Disable picture-in-picture
      if ('disablePictureInPicture' in videoEl) {
        videoEl.disablePictureInPicture = true;
      }
    }
  }

  // Method to be called from parent component
  playVideo(url: string, poster: string, title: string) {
    this.videoUrl = url;
    this.posterUrl = poster;
    this.title = title;
    this.showPlayer = true;
    
    // Initialize player after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.initializePlayer();
    }, 100);
  }
}
