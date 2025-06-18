
document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.querySelector('.play-btn');
    const songs = document.querySelectorAll('.song');
    const progress = document.querySelector('.progress');

    let isPlaying = false;

    
    playBtn.addEventListener('click', function() {
        if (isPlaying) {
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

   
    songs.forEach(song => {
        song.addEventListener('click', function() {
            songs.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            
            
            const songTitle = this.querySelector('h3').textContent;
            const artist = this.querySelector('p').textContent;
            document.querySelector('.now-playing h4').textContent = songTitle;
            document.querySelector('.now-playing p').textContent = artist;
        });
    });

    
    setInterval(() => {
        if (isPlaying) {
            const currentWidth = parseInt(progress.style.width) || 0;
            const newWidth = currentWidth + 1;
            progress.style.width = newWidth + '%';
            
            if (newWidth >= 100) {
                progress.style.width = '0%';
            }
        }
    }, 1000);
});
let currentSong = null;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];


const songs = [
    {
        title: "Everything U are",
        artist: "Hindia",
        cover: "images/foto1.jpg",
        file: "song/hindia-everything.mp3",
        duration: "3:56",
        id: 1
    },
    {
        title: "Janji Palsu",
        artist: "Hindia",
        cover: "images/foto3.jpg",
        file: "song/hindia-janji.mp3",
        duration: "4.10",
        id: 2
    },
    {
        title: "Kids",
        artist: "Hindia",
        cover: "images/foto13.jpg",
        file: "song/hindia-kids.mp3",
        duration: "3.11",
        id: 3
    },
    {
        title: "Aku Tenang",
        artist: "ForTuenti",
        cover: "images/foto18.jpg",
        file: "song/akutenang.mp3",
        duration: "3.33",
        id: 4
    },
    {
        title: "All i want",
        artist: "Kodaline",
        cover: "images/foto20.jpg",
        file: "song/alliwant.mp3",
        duration: "4.54",
        id: 5
    }
];


function initHowler(song) {
    if (currentSong) currentSong.unload();
    
    currentSong = new Howl({
        src: [song.file],
        html5: true,
        onplay: () => {
            isPlaying = true;
            document.getElementById('play-btn').innerHTML = '<i class="fas fa-pause"></i>';
            updateProgressBar();
        },
        onend: () => {
            if (isRepeat) {
                currentSong.play();
            } else {
                playNext();
            }
        }
    });
}


function renderSongs() {
    const songList = document.querySelector('.song-list');
    songList.innerHTML = songs.map(song => `
        <div class="song ${currentSong?.id === song.id ? 'active' : ''}" data-id="${song.id}">
            <img src="${song.cover}" alt="Album Cover">
            <div class="song-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
            </div>
            <span class="duration">${song.duration}</span>
            <i class="fas fa-ellipsis-h"></i>
        </div>
    `).join('');
}


function updateProgressBar() {
    if (!isPlaying) return;
    
    const progress = document.getElementById('progress');
    const timeStart = document.getElementById('time-start');
    const timeEnd = document.getElementById('time-end');
    
    const seek = currentSong.seek() || 0;
    const duration = currentSong.duration() || 1;
    
    progress.style.width = `${(seek / duration) * 100}%`;
    timeStart.textContent = formatTime(seek);
    timeEnd.textContent = formatTime(duration);
    
    requestAnimationFrame(updateProgressBar);
}


function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}


document.addEventListener('DOMContentLoaded', () => {
    renderSongs();
    
   
    document.querySelector('.menu-toggle').addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('collapsed');
    });

    
    document.querySelector('.song-list').addEventListener('click', (e) => {
        const songElement = e.target.closest('.song');
        if (!songElement) return;
        
        const songId = parseInt(songElement.dataset.id);
        const song = songs.find(s => s.id === songId);
        playSong(song);
    });

  
    document.getElementById('play-btn').addEventListener('click', togglePlay);
    document.getElementById('prev-btn').addEventListener('click', playPrevious);
    document.getElementById('next-btn').addEventListener('click', playNext);
    document.getElementById('shuffle-btn').addEventListener('click', toggleShuffle);
    document.getElementById('repeat-btn').addEventListener('click', toggleRepeat);
    document.getElementById('favorite-btn').addEventListener('click', toggleFavorite);
});


function playSong(song) {
    initHowler(song);
    currentSong.play();
    
   
    document.getElementById('now-playing-cover').src = song.cover;
    document.getElementById('now-playing-title').textContent = song.title;
    document.getElementById('now-playing-artist').textContent = song.artist;
    document.getElementById('time-end').textContent = song.duration;
    
   
    document.querySelectorAll('.song').forEach(el => el.classList.remove('active'));
    document.querySelector(`.song[data-id="${song.id}"]`).classList.add('active');
}

function togglePlay() {
    if (!currentSong) return;
    
    if (isPlaying) {
        currentSong.pause();
        document.getElementById('play-btn').innerHTML = '<i class="fas fa-play"></i>';
    } else {
        currentSong.play();
        document.getElementById('play-btn').innerHTML = '<i class="fas fa-pause"></i>';
    }
    isPlaying = !isPlaying;
}
function playPrevious() {
    let prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    playSong(prevIndex);
}

function toggleShuffle() {
    isShuffle = !isShuffle;
    document.getElementById('shuffle-btn').classList.toggle('active', isShuffle);
}

function toggleRepeat() {
    isRepeat = !isRepeat;
    document.getElementById('repeat-btn').classList.toggle('active', isRepeat);
}




