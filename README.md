<!-- !!! DO NOT EDIT, THIS FILE IS GENERATED AUTOMATICALLY !!!  -->

> ℹ️ Please, see the full project documentation here:<br><https://zerocluster.github.io/whisper/>

# `Whisper` speech-to-text (STT) application

Features:

- `NodeJS` [whisper.cpp](https://github.com/ggml-org/whisper.cpp) addon;

- `RPC` interface;

## Debug

```sh
docker run --rm -it \
    -v /var/local/zerocluster/whisper:/var/local/package \
    -v devel_whisper:/var/local/package/data \
    -p 81:81 \
    --entrypoint bash \
    ghcr.io/zerocluster/whisper:next
```
