export default Super =>
    class extends Super {

        // public
        async [ "API_get-models" ] ( ctx ) {
            return [ ...this.app.whisper.models ];
        }

        async [ "API_get-installed-models" ] ( ctx ) {
            return result( 200, [ ...this.app.whisper.installedModels ] );
        }

        async [ "API_get-loaded-models" ] ( ctx ) {
            return result( 200, this.app.whisper.loadedModels );
        }

        async [ "API_install-model" ] ( ctx, model, options ) {
            return this.app.whisper.installModel( model, options );
        }

        async [ "API_unload-model" ] ( ctx, model ) {
            return this.app.whisper.unloadModel( model );
        }

        async [ "API_delete-model" ] ( ctx, model ) {
            return this.app.whisper.deleteModel( model );
        }

        async [ "API_detect-language" ] ( ctx, message, { model } ) {
            return this.app.whisper.detectLanguage( message, { model } );
        }

        async [ "API_transform-speech-to-text" ] ( ctx, message, { model, language } ) {
            return this.app.whisper.transformSpeechToText( message, { model, language } );
        }
    };
