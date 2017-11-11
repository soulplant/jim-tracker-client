local talkTracker = import "./service.libsonnet";

(talkTracker + {useTls: true}).result
