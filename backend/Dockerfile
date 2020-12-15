FROM brazn/opencv:latest
ARG NAME=app
ENV NAME=$NAME
COPY config.json.example //config.json
COPY ./bin/v1.1.0/linux/go-web /$NAME

RUN apt-get update -y && \
    apt-get install -y netcat && \
    rm -vrf /tmp/* && \
    apt autoremove -y && apt autoclean -y && \
    rm -vrf /var/cache/apt/*

ENTRYPOINT [ "sh", "-c", "/$NAME" ]