<!-- !!! DO NOT EDIT, THIS FILE IS GENERATED AUTOMATICALLY !!!  -->

> :information_source: Please, see the full project documentation here:<br><https://zerocluster.github.io/whisper/>

# `Whisper` speech-to-text (STT) application

Features:

- `NodeJS` [whisper.cpp](https://github.com/ggml-org/whisper.cpp) addon;

- `RPC` interface;

## Debug

```sh
d run --rm -it \
    -v /var/local/zerocluster/whisper/lib:/var/local/package/lib \
    -v whisper:/var/local/package/data \
    -p 81:81 \
    --entrypoint bash \
    ghcr.io/zerocluster/whisper
```
