#!/usr/bin/env python3

'''
A script to download my favourite songs from IDAGIO after they have been
scraped in JSON files
'''

import itertools
import json
import os
import sys

import requests
import colorama
import eyed3
import youtube_dl
from colorama import Back, Fore

colorama.init(autoreset=True)
print(colorama.ansi.clear_screen())


# Magic header thanks to which is possible to download the full song from
# IDAGIO and not only the preview. Might change. Got by intercepting HTTPS
# Requests from the Android Studio Emulator with Android 6.0 (later versions
# use SSL Pinning) and Fiddler
youtube_dl.utils.std_headers['Authorization'] = 'Bearer 1L1Y2u1Q1V3u2B2F3M3U2Q162a2Q1c0b0d391X3I262N2V1l1M2k193W1x0R0I2L3M0b3B2c3F3U2C081i0Q3e2i0v28273q3q2s2u1A41312P3e0C0h2l1f363X0C07'
quality = 80
ydl_opts = {
    'format': 'bestaudio/best',
    'postprocessors': [{
        'key': 'FFmpegExtractAudio',
        'preferredcodec': 'mp3',
        'preferredquality': '160' if quality >= 31 and quality <= 60 else '320',
    }]
}
album_art_cache_dir = 'album-art-cache'
if not os.path.exists(album_art_cache_dir):
    os.makedirs(album_art_cache_dir)


def json_path(json_name):
    '''
    Returns a valid path to the json file named `json_name`.json
    '''
    return os.path.join(os.path.dirname(
        os.path.dirname(__file__)), f'out{os.sep}{json_name}.json')


def download_single_track(track_id):
    '''
    Downloads a single track with id that is equal to `track_id` using
    youtube-dl
    '''
    filename = f'{track_id}.mp3'
    url = f'https://api.idagio.com/v1.8/track/{track_id}.m3u8?quality={quality}&client_type=android-1'
    ydl_opts['outtmpl'] = f'{track_id}.%(ext)s'
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        result = ydl.download([url])
    print(Fore.GREEN + '==>' + Fore.WHITE +
          Fore.MAGENTA + f' {filename} ' + Fore.WHITE + 'downloaded')


def add_track_metadata(filename, track_metadata):
    '''
    Updates the metadata of a song saved in `filename` with the contents of
    `track_metadata`
    '''
    cover_path = f'{album_art_cache_dir}{os.sep}{track_metadata["cover_filename"]}'
    audiofile = eyed3.load(filename)

    audiofile.tag.title = track_metadata['title']
    audiofile.tag.track_num = track_metadata['track_num']
    audiofile.tag.album = track_metadata['album']
    audiofile.tag.artist = track_metadata['artist']
    audiofile.tag.album_artist = track_metadata['album_artist']
    audiofile.tag.recording_date = track_metadata['recording_date']
    audiofile.tag.genre = 'Classical'

    try:
        with open(cover_path, 'rb') as file:
            audiofile.tag.images.set(
                3, file.read(), "image/jpeg", u"Photo of " + track_metadata['artist'])
    except ValueError:
        os.remove(cover_path)

    audiofile.tag.save()
    print('    ' + Fore.CYAN + '::' + Fore.WHITE +
          ' Updated metadata of ' + Fore.MAGENTA + filename)


def download_cover_image(composer_id):
    '''
    Download the image of the composer to use as the album cover for the .mp3
    file. If the image has already been downloaded, use the cached version
    '''
    print('    ' + Fore.CYAN + '::' + Fore.WHITE +
          ' Starting to download the album cover...')

    composer_image_filename = f'composer-{composer_id}.jpg'
    artist_image_url = f'https://idg-prod.imgix.net/artists/{composer_id}/main.jpg?auto=format&dpr=1&crop=faces&fit=crop&w=640&h=640'

    if os.path.exists(f'{album_art_cache_dir}{os.sep}{composer_image_filename}'):
        print(Fore.YELLOW + '    >> ' + Fore.CYAN + f'{artist_image_url} ' + Fore.WHITE +
              'already downloaded')
        print(
            '       Using the cached image at ' + Fore.MAGENTA + f'{album_art_cache_dir}{os.sep}{composer_image_filename}')
        return composer_image_filename

    res = requests.get(artist_image_url)
    with open(f'{album_art_cache_dir}{os.sep}{composer_image_filename}', 'wb') as file:
        file.write(res.content)

    print(Fore.GREEN + '    -> ' + Fore.MAGENTA +
          f'{composer_image_filename} ' + Fore.WHITE + 'downloaded')
    return composer_image_filename


def download_recordings(recordings):
    '''
    Download the recordings included in out/fav-recordings.json
    '''
    for recording in recordings:
        recording_title = recording['work']['title']
        composer = recording['work']['composer']['name']
        composer_id = recording['work']['composer']['id']

        # Print the recording infos
        print(Fore.GREEN + '\n==>' + Fore.WHITE + ' Downloading Recording ' +
              Fore.BLUE + recording_title + Fore.WHITE + ' by ' + Fore.YELLOW + composer)

        for track in recording['tracks']:
            # Track title
            for workpart in recording['work']['workparts']:
                for piece in workpart['pieces']:
                    if piece['id'] == track['piece']['id']:
                        track_title = piece['title']
                        track_position = piece['position']

            # Print the track infos
            print(Fore.GREEN + '    ->' + Fore.WHITE +
                  ' Track ID: ' + Fore.MAGENTA + str(track['id']) + Fore.WHITE + ', Track Title: ' + Fore.CYAN + track_title)

            # Download the image of the composer
            composer_image_filename = download_cover_image(composer_id)

            # Track metadata
            track_metadata = {
                'title': track_title,
                'track_num': track_position,
                'album': recording_title,
                'artist': recording['summary'],
                'album_artist': composer,
                'cover_filename': composer_image_filename,
                'recording_date': recording['recordingDate']['from']
            }

            # Skip if the track has already been downloaded
            filename = f'{track["id"]}.mp3'
            if os.path.isfile(filename):
                print(Fore.YELLOW + '    >> ' + Fore.MAGENTA +
                      f'{filename} ' + Fore.WHITE + 'already downloaded. Skipping')
                # Add metadata to the downloaded song using ID3 tags
                add_track_metadata(filename, track_metadata)
                continue

            # Download the track using youtube-dl
            download_single_track(track['id'])
            # Add metadata to the downloaded song using ID3 tags
            add_track_metadata(filename, track_metadata)


def download_tracks(tracks):
    '''
    Download the tracks included in out/fav-tracks.json
    '''
    for track in tracks:
        track_title = track['piece']['title']
        recording_title = f'{track["piece"]["workpart"]["work"]["title"]} - {track_title}'
        composer = track['piece']['workpart']['work']['composer']['name']
        composer_id = track['piece']['workpart']['work']['composer']['id']

        # Print the track infos
        print(Fore.GREEN + '\n==>' + Fore.WHITE + ' Downloading Track ' +
              Fore.BLUE + recording_title + Fore.WHITE + ' by ' + Fore.YELLOW + composer)
        print(Fore.GREEN + '    ->' + Fore.WHITE +
              ' Track ID: ' + Fore.MAGENTA + str(track['id']) + Fore.WHITE + ', Track Title: ' + Fore.CYAN + track_title)

        # Download the image of the composer
        composer_image_filename = download_cover_image(composer_id)

        # Track metadata
        track_metadata = {
            'title': recording_title,
            'track_num': track['position'],
            'album': track_title,
            'artist': track['recording']['summary'],
            'album_artist': composer,
            'cover_filename': composer_image_filename,
            'recording_date': track['recording']['recordingDate']['from']
        }

        # Skip if the track has already been downloaded
        filename = f'{track["id"]}.mp3'
        if os.path.isfile(filename):
            print(Fore.YELLOW + '    >> ' + Fore.MAGENTA +
                  f'{filename} ' + Fore.WHITE + 'already downloaded. Skipping')
            # Add metadata to the downloaded song using ID3 tags
            add_track_metadata(filename, track_metadata)
            continue

        # Download the track using youtube-dl
        download_single_track(track['id'])
        # Add metadata to the downloaded song using ID3 tags
        add_track_metadata(filename, track_metadata)


def read_json(file_name):
    '''
    Parse the JSON files and returns a list containing only the results
    '''
    with open(json_path(file_name), encoding='utf8') as file:
        return list(itertools.chain(*[x['results'] for x in json.loads(file.read())]))


def main():
    print(Fore.GREEN + '==>' + Fore.WHITE +
          ' Starting to download all the recordings\n')
    download_recordings(read_json('fav-recordings'))
    print(Fore.GREEN + '\n==>' + Fore.WHITE +
          ' Starting to download all the tracks')
    download_tracks(read_json('fav-tracks'))
    print(Fore.GREEN + '\n==>' + Fore.WHITE +
          ' All done!')


if __name__ == '__main__':
    main()
