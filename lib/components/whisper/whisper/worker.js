import { promisify } from "node:util";
import externalResources from "#core/external-resources";
import { require } from "#core/utils";

const resource = await externalResources
    .add(
        {
            "id": "zerocluster/whisper/resources/whisper",
            "node": true,
            "caller": import.meta.url,
        },
        {
            "autoUpdate": false,
            "location": "package",
        }
    )
    .check();

const whisper = require( resource.getResourcePath( "whisper.node" ) ),
    whisperAsync = promisify( whisper.whisper );

export default class {
    async [ "API_run-whisper" ] ( params ) {
        const data = await whisperAsync( params );

        return result( 200, data );
    }
}
