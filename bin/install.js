#!/usr/bin/env -S node

import Cli from "#core/cli";
import externalResources from "#core/external-resources";

const CLI = {
    "title": "Update resources",
    "options": {
        "force": {
            "description": "force update",
            "default": false,
            "schema": {
                "type": "boolean",
            },
        },
    },
};

await Cli.parse( CLI );

externalResources.add( "corejslib/core/resources/ffmpeg-" + process.platform );

if ( process.platform === "linux" ) {
    externalResources.add(
        {
            "id": "zerocluster/whisper/resources/whisper",
            "node": true,
        },
        {
            "location": "package",
        }
    );
}

const res = await externalResources.update( {
    "force": process.cli.options.force,
} );

if ( !res.ok ) process.exit( 1 );
