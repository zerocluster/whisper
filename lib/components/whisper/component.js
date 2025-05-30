import Whisper from "./whisper.js";

export default Super =>
    class extends Super {

        // protected
        async _install () {
            return new Whisper( this.app, this.config );
        }

        async _init () {
            return this.instance.init();
        }
    };
