import { promisify } from "node:util";
import { require } from "@softvisio/utils/utils";

const { whisper } = require( "/var/local/whisper.node" ),
    whisperAsync = promisify( whisper );

export default class {
    async [ "API_destroy" ] () {
        process.exit();
    }

    async [ "API_run-whisper" ] ( params ) {
        const data = await whisperAsync( params );

        return result( 200, data );
    }
}
