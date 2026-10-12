#!/usr/bin/env -S node

import WhisperApi from "#core/api/whisper";
import File from "#core/file";

const api = new WhisperApi( "ws://whisper.devel.softvisio.net:81/api" );

var res;

// res = await api.detectLanguage( new File( { "path": "test.ogg" } ), {

//     // "model": "large-v3-turbo", // "tiny",
// } );
// console.log( "detect:", res );

res = await api.transformSpeechToText( new File( { "path": "test.ogg" } ), {

    // "model": "large-v3-turbo", // "tiny",
    "language": "ru",
} );
console.log( "transform:", res );

// res = await api.getInstalledModels();
// console.log( "installed models:", res );

// res = await api.getLoadedModels();
// console.log( "loaded models:", res );

// res = await api.unloadModel( "large-v3-turbo" );
// console.log( "unload:", res );

// res = await api.getLoadedModels();
// console.log( "loaded models:", res );

process.exit();
