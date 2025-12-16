FROM ghcr.io/zerocluster/node AS build

ARG WHISPER_VERSION=master

RUN \
    apt-get update && apt-get install -y git jq g++ cmake \
    && mkdir whisper.cpp && cd whisper.cpp \
    \
    # build latest release
    && if [[ $WHISPER_VERSION == "latest" ]]; then \
        TAG=$(curl -s https://api.github.com/repos/ggml-org/whisper.cpp/releases/latest | jq --raw-output ".tag_name") \
        && curl -fsSL https://github.com/ggml-org/whisper.cpp/archive/refs/tags/${TAG}.tar.gz | tar --strip-components=1 -xz \
    \
    # build master branch (pre-prelease)
    ; elif [[ $WHISPER_VERSION == "master" ]]; then \
        curl -fsSL https://github.com/ggml-org/whisper.cpp/archive/master.tar.gz | tar --strip-components=1 -xz \
    \
    # invalid WHISPER_VERSION
    ; else \
        echo "WHISPER_VERSION is not valid" \
        && exit 1 \
    ; fi \
    \
    && npm install cmake-js node-addon-api \
    && npx cmake-js compile -T addon.node -B Release --verbose --CDBUILD_SHARED_LIBS=OFF --CDCMAKE_POSITION_INDEPENDENT_CODE=ON

FROM ghcr.io/zerocluster/node/app

COPY --from=build /var/local/whisper.cpp/build/Release/addon.node.node /var/local/whisper.node

RUN \
    --mount=type=secret,id=GITHUB_TOKEN,env=GITHUB_TOKEN \
    \
    # install dependencies
    && NODE_ENV=production npm install-clean \
    \
    # cleanup
    && script=$(curl -fsSL "https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh") \
    && bash <(echo "$script") cleanup
