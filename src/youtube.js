import ytdl from 'ytdl-core'
import fetch from 'node-fetch';
export async function FetchMediaBuffer(url){
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return buffer;
}

export async function parseInfo(url) {
    const info = await ytdl.getInfo(url);
    const bestquality = info.formats.map((spec) => {
        return {
            quality: spec?.qualityLabel,
            container: spec?.container,
            url: spec?.url,
            codecs: spec?.codecs,
            audioQuality: spec?.audioQuality
        };
    });

    return {
        title: info.videoDetails.title,
        author: info.videoDetails.author.name,
        qualities: bestquality
    };
}

export async function DownloadAudioOnly(videoArray) {
    const getAudio = videoArray.qualities.filter(
        (audio) => audio.codecs === 'mp4a.40.2' && audio.audioQuality === 'AUDIO_QUALITY_MEDIUM'
    );

    console.log(getAudio);
  const nameMP =  videoArray.title.replace(/["', ]/g,'');
  
 const infForSend =  [getAudio[0].url, nameMP]
    return infForSend
}