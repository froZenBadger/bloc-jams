var setSong = function(songNumber) {
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};


var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber
      + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
    var $row = $(template);
    
    var clickHandler = function() {
        var songNumber = parseInt($(this).attr('data-song-number'));
        
        if (currentlyPlayingSongNumber !== null) {
            // Revert to song number for currently playing song because user started playing new song.
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        }
        if (currentlyPlayingSongNumber !== songNumber) {
            // Switch from Play -> Pause button to indicate new song is playing.
            $(this).html(pauseButtonTemplate);
            setSong(songNumber);
            updatePlayerBarSong();
        } else if (currentlyPlayingSongNumber === songNumber) {
            // Switch from Pause -> Play button to pause currently playing song.
            $(this).html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentlyPlayingSongNumber = null;
            currentSongFromAlbum = null;
        }
    };    
    
    var onHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(playButtonTemplate);
        }
    };

    var offHover = function(event) {
        var songNumberCell = $(this).find('.song-item-number');
        var songNumber = parseInt(songNumberCell.attr('data-song-number'));

        if (songNumber !== currentlyPlayingSongNumber) {
            songNumberCell.html(songNumber);
        }
    };

    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
     currentAlbum = album;     
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     
     $albumSongList.empty();
 
     
     for (var i = 0; i < album.songs.length; i++) {
        var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
        $albumSongList.append($newRow);
     }
 };

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var changeSong = function(direction) {
    
    var nextSong = function() {
        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        currentSongIndex++;
        if (currentSongIndex >= currentAlbum.songs.length) {
            currentSongIndex = 0;
        }

        var lastSongNumber = currentlyPlayingSongNumber; 

        currentlyPlayingSongNumber = currentSongIndex + 1;
        currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

        updatePlayerBarSong();

        var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
        var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

        $nextSongNumberCell.html(pauseButtonTemplate);
        $lastSongNumberCell.html(lastSongNumber);
    };
    
    var previousSong = function() {
        var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = (currentAlbum.songs.length - 1);
        }

        var lastSongNumber = currentlyPlayingSongNumber; 

        currentlyPlayingSongNumber = currentSongIndex + 1;
        currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

        updatePlayerBarSong();

        var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
        var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

        $nextSongNumberCell.html(pauseButtonTemplate);
        $lastSongNumberCell.html(lastSongNumber);
    };
    
    if (direction == 'next') { 
        nextSong();
    }  else {
        console.log('Need to specify direction!');
    }
    if (direction == 'previous') {
        previousSong();
    } else {
        console.log('Need to specify direction!');
    }
};


var updatePlayerBarSong = function() {
    $('h2.song-name').text(currentSongFromAlbum.title);
    $('h3.artist-name').text(currentAlbum.artist);
    $('h2.artist-song-mobile').text(currentSongFromAlbum.title + ' - ' + currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var paused = 1;
var pauseSong = function() {
    if (currentlyPlayingSongNumber !== null) { 
        $('.main-controls .play-pause').html(playerBarPlayButton);
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
        paused++;
    }
    if (paused % 2 == 0) { 
        $('.main-controls .play-pause').html(playerBarPauseButton);
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
    }
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>'

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playButton = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumMarconi);
    $previousButton.click(function() {
        changeSong('previous');
    });
    $nextButton.click(function() {
        changeSong('next');
    });
    $playButton.click(pauseSong);   
 });
