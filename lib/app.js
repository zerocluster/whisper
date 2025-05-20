import childProcess from "node:child_process";
import App from "#core/app";

export default class extends App {
    #ollama;

    // propeties
    get location () {
        return import.meta.url;
    }

    // protected
    async _init () {
        return result( 200 );
    }

    async _start () {

        // start ollama
        this.#ollama = childProcess.spawn( "ollama", [ "serve" ], {
            "env": {
                ...process.env,
                "OLLAMA_MODELS": "/var/local/package/data/ollama/models",
            },
            "stdio": [ "ignore", "inherit", "inherit" ],
        } );

        this.#ollama.on( "exit", ( code, signal ) => process.destroy( { code } ) );

        return result( 200 );
    }
}
