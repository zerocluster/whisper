import App from "#core/app";
import Whisper from "#lib/whisper";

export default class extends App {
    #whisper;

    // propeties
    get location () {
        return import.meta.url;
    }

    get whisper () {
        return this.#whisper;
    }

    // protected
    async _init () {
        return result( 200 );
    }

    async _start () {

        // init whisper
        this.#whisper = new Whisper( {
            "modelsPath": this.env.dataDir + "/whisper/models",
            "model": "small",
        } );

        const res = await this.#whisper.installModel( "small" );
        if ( !res.ok ) return res;

        return result( 200 );
    }
}
