#!/usr/bin/env python3

"""
A script to download songs from IDAGIO by specifying their IDs.
"""

import sys
from argparse import ArgumentParser

import youtube_dl


def parse_args():
    parser = ArgumentParser(description=__doc__)

    parser.add_argument("-i",
                        help="""
                        the id of the song to download. Default: 23145233
                        """,
                        type=str)

    parser.add_argument("-q",
                        help="""
                        the quality of the song. Can range from 1 to 80, default: 80.
                        """,
                        type=int)

    return parser.parse_args()


def main():
    # Magic header thanks to which is possible to download the full song from
    # IDAGIO and not only the preview. Might change. Got by intercepting HTTPS
    # Requests from the Android Studio Emulator with Android 6.0 (later versions
    # use SSL Pinning) and Fiddler
    youtube_dl.utils.std_headers["Authorization"] = "Bearer 1L1Y2u1Q1V3u2B2F3M3U2Q162a2Q1c0b0d391X3I262N2V1l1M2k193W1x0R0I2L3M0b3B2c3F3U2C081i0Q3e2i0v28273q3q2s2u1A41312P3e0C0h2l1f363X0C07"

    track_id = "23145233"
    quality = 80
    args = parse_args()
    if args.q:
        quality = args.q
    if args.i:
        track_id = args.i
    uri = f"https://api.idagio.com/v1.8/track/{track_id}.m3u8?quality={quality}&client_type=android-1"

    ydl_opts = {
        "format": "bestaudio/best",
        "postprocessors": [{
            "key": "FFmpegExtractAudio",
            "preferredcodec": "mp3",
            "preferredquality": "160" if quality >= 31 and quality <= 60 else "320",
        }],
        "outtmpl": f"{track_id}.%(ext)s"
    }
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        result = ydl.download([uri])


if __name__ == "__main__":
    main()
