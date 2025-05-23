FROM ghcr.io/zerocluster/node AS build

RUN \
    apt-get update && apt-get install -y git g++ cmake \
    && git clone https://github.com/ggerganov/whisper.cpp \
    && cd whisper.cpp \
    && npm install cmake-js node-addon-api \
    && npx cmake-js compile -T addon.node -B Release

FROM ghcr.io/zerocluster/node/app

COPY --from=build /var/local/whisper.cpp/build/Release/addon.node.node /var/local/whisper.node
COPY --from=build /var/local/whisper.cpp/build/Release/libggml.so /usr/local/lib/libggml.so
COPY --from=build /var/local/whisper.cpp/build/Release/libggml-base.so /usr/local/lib/libggml-base.so
COPY --from=build /var/local/whisper.cpp/build/Release/libggml-cpu.so /usr/local/lib/libggml-cpu.so
COPY --from=build /var/local/whisper.cpp/build/Release/libwhisper.so /usr/local/lib/libwhisper.so.1

RUN \
    apt-get update && apt-get install -y ffmpeg \
    \
    # install dependencies
    && NODE_ENV=production npm install-clean \
    \
    # cleanup
    && /usr/bin/env bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh) cleanup
