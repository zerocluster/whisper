import fetch from "#core/fetch";

// DOCS: https://github.com/ollama/ollama/blob/main/docs/api.md

export default Super =>
    class extends Super {

        // public
        async [ "API_get-version" ] ( ctx ) {
            return this.#doRequest( "version" );
        }

        async [ "API_get-models" ] ( ctx ) {
            return this.#doRequest( "tags" );
        }

        async [ "API_get-loaded-models" ] ( ctx ) {
            return this.#doRequest( "ps" );
        }

        async [ "API_get-model-info" ] ( ctx, model, { verbose = false } = {} ) {
            return this.#doRequest( "show", {
                model,
                verbose,
            } );
        }

        async [ "API_install-model" ] ( ctx, model, { stream = false } = {} ) {
            return this.#doRequest( "pull", {
                model,
                "stream": false,
            } );
        }

        async [ "API_delete-model" ] ( ctx, model ) {
            return this.#doRequest(
                "delete",
                {
                    model,
                },
                "DELETE"
            );
        }

        async [ "API_get-chat-completion" ] ( ctx, { model, messages, stream = false, ...options } = {} ) {
            return this.#doRequest( "chat", {
                model,
                messages,
                "stream": false,
                ...options,
            } );
        }

        async [ "API_get-completion" ] ( ctx, { model, prompt, stream = false, ...options } = {} ) {
            return this.#doRequest( "generate", {
                model,
                prompt,
                "stream": false,
                ...options,
            } );
        }

        async [ "API_get-embedding" ] ( ctx, { model, input, ...options } = {} ) {
            return this.#doRequest( "embed", {
                model,
                input,
                ...options,
            } );
        }

        // private
        // XXX add stream support
        async #doRequest ( path, body, method ) {
            const url = `http://127.0.0.1:11434/api/${ path }`;

            const res = await fetch( url, {
                "method": method || ( body
                    ? "POST"
                    : "GET" ),
                "headersTimeout": 0,
                "body": body
                    ? JSON.stringify( body )
                    : undefined,
            } );

            if ( !res.ok ) return res;

            const data = await res.json();

            return result( 200, data );
        }
    };
