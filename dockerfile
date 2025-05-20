FROM ghcr.io/zerocluster/node/app

RUN \
    # install ollama
    /usr/bin/env bash <(curl -fsSL https://ollama.com/install.sh) \
    \
    # cleanup
    && /usr/bin/env bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh) cleanup

RUN \
    # install dependencies
    NODE_ENV=production npm install-clean \
    \
    # cleanup
    && /usr/bin/env bash <(curl -fsSL https://raw.githubusercontent.com/softvisio/scripts/main/env-build-node.sh) cleanup
