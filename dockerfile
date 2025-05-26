FROM ghcr.io/zerocluster/node AS build

RUN \
    apt-get update && apt-get install -y git g++ cmake \
    && git clone https://github.com/ggerganov/whisper.cpp \
    && cd whisper.cpp \
    && npm install cmake-js node-addon-api \
    && npx cmake-js compile -T addon.node -B Release --verbose --CDBUILD_SHARED_LIBS=OFF --CDCMAKE_POSITION_INDEPENDENT_CODE=ON

FROM ghcr.io/zerocluster/node/app

COPY --from=build /var/local/whisper.cpp/build/Release/addon.node.node /var/local/whisper.node

RUN \
    apt-get update && apt-get install -y ffmpeg \
    \
    # install dependencies
    && NODE_ENV=production npm install-clean \
    \
    # cleanup
    && /usr/bin/env bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh) cleanup
