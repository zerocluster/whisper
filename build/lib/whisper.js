import childProcess from "node:child_process";
import fs from "node:fs";
import { pipeline } from "node:stream/promises";
import ExternalResourceBuilder from "#core/external-resource-builder";
import fetch from "#core/fetch";
import tar from "#core/tar";
import { TmpDir } from "#core/tmp";

const WHISPER_VERSION = "latest"; // "next";

export default class ExternalResource extends ExternalResourceBuilder {
    #whisperVersion;
    #tag;

    constructor () {
        super( {
            "id": "zerocluster/whisper/resources/whisper",
            "node": true,
        } );
    }

    // protected
    async _getEtag () {
        const res = await this.#getWhisperVersion();
        if ( !res.ok ) return res;

        return result( 200, "whisper:" + this.#whisperVersion );
    }

    async _build ( location ) {
        let res;

        const tmp = new TmpDir();

        res = childProcess.spawnSync( "sudo", [ "apt-get", "update", "-y" ], {
            "cwd": tmp.path,
            "stdio": "inherit",
        } );
        if ( res.error ) throw res.error;
        if ( res.status ) return result( 500 );

        res = childProcess.spawnSync( "sudo", [ "apt-get", "install", "-y", "git", "jq", "g++", "cmake" ], {
            "cwd": tmp.path,
            "stdio": "inherit",
        } );
        if ( res.error ) throw res.error;
        if ( res.status ) return result( 500 );

        res = await fetch( `https://github.com/ggml-org/whisper.cpp/archive/refs/tags/${ this.#tag }.tar.gz` );
        if ( !res.ok ) return res;

        // download and unpack
        await pipeline(
            res.body,
            tar.extract( {
                "cwd": tmp.path,
                "strip": 1,
            } )
        );

        res = childProcess.spawnSync( "npm", [ "install", "cmake-js", "node-addon-api" ], {
            "cwd": tmp.path,
            "stdio": "inherit",
        } );
        if ( res.error ) throw res.error;
        if ( res.status ) return result( 500 );

        res = childProcess.spawnSync(
            "npx",
            [
                "cmake-js",
                "compile",
                "-T",
                "addon.node",
                "-B",
                "Release",
                "--verbose",
                "--CDBUILD_SHARED_LIBS=OFF",
                "--CDCMAKE_POSITION_INDEPENDENT_CODE=ON",

                // do not depend on libgomp
                "--CDGGML_OPENMP=OFF",

                // do not optimize for the build machine CPU (avoids SIGILL on other CPUs)
                "--CDGGML_NATIVE=OFF",

                // statically link libstdc++ and libgcc
                "--CDCMAKE_SHARED_LINKER_FLAGS=-static-libstdc++ -static-libgcc",
                "--CDCMAKE_MODULE_LINKER_FLAGS=-static-libstdc++ -static-libgcc",
            ],
            {
                "cwd": tmp.path,
                "stdio": "inherit",
            }
        );
        if ( res.error ) throw res.error;
        if ( res.status ) return result( 500 );

        fs.copyFileSync( tmp.path + "/build/Release/addon.node", location + "/whisper.node" );

        return result( 200 );
    }

    async _getMeta () {
        return result( 200, {
            "whisper": this.#whisperVersion,
        } );
    }

    // private
    async #getWhisperVersion () {
        if ( WHISPER_VERSION === "next" ) {
            this.#tag = "master";
            this.#whisperVersion = "master";
        }
        else {
            const res = await this.gitHubApi.getLatestRelease( "ggml-org/whisper.cpp" );
            if ( !res.ok ) return res;

            this.#tag = res.data.tag_name;
            this.#whisperVersion = res.data.tag_name;
        }

        return result( 200 );
    }
}
