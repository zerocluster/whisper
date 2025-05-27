export default Super =>
    class extends Super {

        // public
        async [ "API_get-models" ] ( ctx ) {
            return [ ...this.app.whisper.models ];
        }

        async [ "API_get-installed-models" ] ( ctx ) {
            return [ ...this.app.whisper.installedModels ];
        }

        async [ "API_install-model" ] ( ctx, model, options ) {
            return this.app.whisper.installModel( model, options );
        }

        async [ "API_delete-model" ] ( ctx, model ) {
            return this.app.whisper.deleteModel( model );
        }

        async [ "API_transform-speech-to-text" ] ( ctx, audioFile, { model, language } ) {
            return this.app.whisper.transformSpeechToText( audioFile, { model, language } );
        }
    };
