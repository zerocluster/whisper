export default Super =>
    class extends Super {

        // public
        async [ "API_get-models" ] ( ctx ) {
            return [ ...this.app.whisper.models ];
        }

        async [ "API_install-model" ] ( ctx, model ) {
            return this.app.whisper.installModel( model );
        }

        async [ "API_delete-model" ] ( ctx, model ) {
            return this.app.whisper.deleteModel( model );
        }

        async [ "API_get-text" ] ( ctx, { audio, model, language } ) {
            return this.app.whisper.getText( audio, { model, language } );
        }
    };
