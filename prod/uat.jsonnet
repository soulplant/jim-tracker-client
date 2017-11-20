local talkTracker = import "./service.libsonnet";

(talkTracker + {
  name: 'jim-tracker-uat',
  useTls: false,
  host: 'jim-uat.dev.helixta.com.au',
}).result
