local talkTracker = import "./service.libsonnet";

(talkTracker + {
  name: 'talk-tracker-uat',
  useTls: false,
  host: 'talks-uat.dev.helixta.com.au',
}).result