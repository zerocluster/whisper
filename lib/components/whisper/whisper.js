import childProcess from "node:child_process";
import fs from "node:fs";
import { promisify } from "node:util";
import { require } from "@softvisio/utils/utils";
import fetch from "#core/fetch";
import { globSync } from "#core/glob";
import Mutex from "#core/threads/mutex";
import { TmpFile } from "#core/tmp";

const MODELS = new Set( [

    //
    "tiny",
    "tiny.en",
    "tiny-q5_1",
    "tiny.en-q5_1",
    "tiny-q8_0",
    "base",
    "base.en",
    "base-q5_1",
    "base.en-q5_1",
    "base-q8_0",
    "small",
    "small.en",
    "small.en-tdrz",
    "small-q5_1",
    "small.en-q5_1",
    "small-q8_0",
    "medium",
    "medium.en",
    "medium-q5_0",
    "medium.en-q5_0",
    "medium-q8_0",
    "large-v1",
    "large-v2",
    "large-v2-q5_0",
    "large-v2-q8_0",
    "large-v3",
    "large-v3-q5_0",
    "large-v3-turbo",
    "large-v3-turbo-q5_0",
    "large-v3-turbo-q8_0",
] );

const { whisper } = require( "/var/local/whisper.node" );

const whisperAsync = promisify( whisper );

export default class Whisper {
    #app;
    #config;
    #modelsPath;
    #mutexSet = new Mutex.Set();
    #installedModels;

    constructor ( app, config ) {
        this.#app = app;
        this.#config = config;

        this.#modelsPath = app.env.dataDir + "/whisper/models";
    }

    // properties
    get app () {
        return this.#app;
    }

    get config () {
        return this.#config;
    }

    get modelsPath () {
        return this.#modelsPath;
    }

    get models () {
        return MODELS;
    }

    get defaultModel () {
        return this.#config.defaultModel;
    }

    get installedModels () {
        return this.#installedModels;
    }

    // public
    async init () {
        this.#installedModels = new Set( globSync( "*.bin", {
            "cwd": this.#modelsPath,
        } )
            .map( file => file.replace( ".bin", "" ) )
            .filter( model => MODELS.has( model ) ) );

        return result( 200 );
    }

    async getText ( audioFile, { model, language } = {} ) {
        model ||= this.defaultModel;

        var res, wavFile;

        try {
            if ( !this.isModelValid( model ) ) throw result( [ 400, "Invalid model" ] );

            // install missed model
            if ( !this.#installedModels.has( model ) ) {
                res = await this.installModel( model );

                if ( !res.ok ) throw res;
            }

            wavFile = new TmpFile( {
                "extname": ".wav",
            } );

            // convert audio to wav
            res = await new Promise( resolve => {
                const proc = childProcess.spawn( "ffmpeg", [ "-i", audioFile.path, "-ar", 16_000, "-ac", 1, "-c:a", "pcm_s16le", wavFile.path ], {
                    "stdio": "ignore",
                } );

                proc.once( "exit", code => {
                    if ( code ) {
                        resolve( result( 500 ) );
                    }
                    else {
                        resolve( result( 200 ) );
                    }
                } );
            } );
            if ( !res.ok ) throw res;

            const params = {
                "language": language || "auto",
                "model": this.modelsPath + "/" + model + ".bin",
                "fname_inp": wavFile.path,
                "use_gpu": true,
                "flash_attn": false,
                "no_prints": true,
                "comma_in_time": false,
                "translate": false,
                "no_timestamps": true,
                "audio_ctx": 0,
                "max_len": 0,
                "progress_callback": progress => {},
            };

            const data = await whisperAsync( params );

            res = result(
                200,
                data
                    .map( part => part[ 2 ] )
                    .join( "\n" )
                    .trim()
            );
        }
        catch ( e ) {
            res = result.catch( e );
        }

        // cleanup
        audioFile.destroy();
        wavFile?.destroy();

        return res;
    }

    async installModel ( model ) {
        if ( !this.isModelValid( model ) ) return result( [ 400, "Invalid model" ] );

        if ( this.#installedModels.has( model ) ) return result( 200 );

        const mutex = this.#mutexSet.get( model );

        if ( !mutex.tryLock() ) return mutex.wait();

        fs.mkdirSync( this.#modelsPath, {
            "recursive": true,
        } );

        const modelPath = this.#modelsPath + "/" + model + ".bin";

        const url = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${ model }.bin`;

        var res;

        try {
            res = await fetch( url );
            if ( !res.ok ) throw res;

            const tmp = await res.tmpFile();

            await fs.promises.cp( tmp.path, modelPath );

            tmp.destroy();

            this.#installedModels.add( model );

            res = result( 200 );
        }
        catch ( e ) {
            res = result.catch( e );
        }

        mutex.unlock( res );

        return res;
    }

    async deleteModel ( model ) {
        if ( !this.isModelValid( model ) ) return result( [ 400, "Invalid model" ] );

        if ( !this.#installedModels.has( model ) ) return result( 200 );

        const modelPath = this.#modelsPath + "/" + model + ".bin";

        await fs.promises.rm( modelPath, {
            "force": true,
        } );

        this.#installedModels.delete( model );

        return result( 200 );
    }

    isModelValid ( model ) {
        return MODELS.has( model );
    }
}
