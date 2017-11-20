FROM golang
ADD build /files
ADD jim-tracker /jim-tracker
WORKDIR /
CMD /jim-tracker
