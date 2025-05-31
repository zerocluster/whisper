# `Whisper` speech-to-text (STT) application

Features:

- `NodeJS` [whisper.cpp](https://github.com/ggml-org/whisper.cpp) addon;

- `RPC` interface;

## Debug

```sh
docker run --rm -it \
    -v /var/local/zerocluster/whisper:/var/local/whisper-devel \
    -v devel_whisper:/var/local/whisper-devel/data \
    -p 81:81 \
    --entrypoint bash \
    ghcr.io/zerocluster/whisper:next
```
