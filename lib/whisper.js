import fs from "node:fs";
import { promisify } from "node:util";
import { require } from "@softvisio/utils/utils";
import fetch from "#core/fetch";
import { TmpFile } from "#cpre/tmp";

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
    #modelsPath;
    #model;

    constructor ( { modelsPath, model } = {} ) {
        this.#modelsPath = modelsPath;
        this.#model = model;
    }

    // properties
    get modelsPath () {
        return this.#modelsPath;
    }

    get models () {
        return MODELS;
    }

    get model () {
        return this.#model;
    }

    // public
    async getText ( audio, { model, ...options } = {} ) {
        const tmp = new TmpFile();

        await fs.promises.writeFile( tmp.path, Buffer.from( audio, "base64" ) );

        const whisperParams = {
            "language": options.language,
            "model": this.modelsPath + "/" + ( model || this.#model ) + ".bif",
            "fname_inp": tmp.path,
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

        whisperAsync( whisperParams ).then( result => {
            console.log();
            console.log( result );
        } );
    }

    async installModel ( model ) {
        fs.mkdirSync( this.#modelsPath, {
            "recursive": true,
        } );

        const modelPath = this.#modelsPath + "/" + model + ".bin";

        if ( !fs.existsSync( modelPath ) ) {
            const url = `https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-${ model }.bin`;

            const res = await fetch( url );
            if ( !res.ok ) return res;

            const tmp = await res.tmpFile( {
                "path": modelPath + ".tmp",
            } );

            const ok = await fs.promises.rename( tmp.path, modelPath );
            if ( !ok ) return result( 500 );
        }

        return result( 200 );
    }

    async deleteModel ( model ) {
        const modelPath = this.#modelsPath + "/" + model + ".bin";

        await fs.promises.rm( modelPath, {
            "force": true,
        } );

        return result( 200 );
    }
}
