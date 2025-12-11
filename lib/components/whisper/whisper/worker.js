import { promisify } from "node:util";
import { require } from "@c0rejs/utils/utils";

const { whisper } = require( "/var/local/whisper.node" ),
    whisperAsync = promisify( whisper );

export default class {
    async [ "API_run-whisper" ] ( params ) {
        const data = await whisperAsync( params );

        return result( 200, data );
    }
}
