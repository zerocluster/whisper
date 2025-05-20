import fs from "node:fs";
import { promisify } from "node:util";
import { require } from "@softvisio/utils/utils";

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

    get model () {
        return this.#model;
    }

    // public
    async getText ( audio, { model, ...options } = {} ) {
        const whisperParams = {
            "language": "en",
            "model": this.modelsPath + "/" + ( model || this.#model ) + ".bif",
            "fname_inp": audio,
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

    // XXX
    async installModel ( model ) {
        fs.mkdirSync( this.#modelsPath, {
            "recursive": true,
        } );

        const modelPath = this.#modelsPath + "/" + model + ".bin";

        if ( !fs.existsSync( modelPath ) ) {

            // XXX
        }

        return result( 200 );
    }
}
