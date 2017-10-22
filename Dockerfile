FROM golang
# ADD src /src/github.com/soulplant/talk-tracker
# WORKDIR /src
# RUN go-wrapper download
# RUN go-wrapper install
# RUN mv talk-tracker /
ADD build /files
ADD talk-tracker /talk-tracker
WORKDIR /
# CMD ["go-wrapper", "run", "talk-tracker"]
# ENTRYPOINT /talk-tracker
CMD /talk-tracker