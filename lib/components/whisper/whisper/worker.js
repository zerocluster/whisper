import { promisify } from "node:util";
import whisper from "@corejslib/whisper";

const whisperAsync = promisify( whisper );

export default class {
    async [ "API_run-whisper" ] ( params ) {
        const data = await whisperAsync( params );

        return result( 200, data );
    }
}
