local k = import "./ksonnet-lib/ksonnet.beta.2/k.libsonnet";
local deployment = k.apps.v1beta1.deployment;
local volumes = deployment.mixin.spec.template.spec.volumes;
local volume = deployment.mixin.spec.template.spec.volumesType;
local container = deployment.mixin.spec.template.spec.containersType;
local service = k.core.v1.service;

local ingress = k.extensions.v1beta1.ingress;

local ingressRule(host, path, serviceName, servicePort) = {
  host: host,
  http: {
    paths+: [{
      path: path,
      backend: {
        serviceName: serviceName,
        servicePort: servicePort,
      },
    }],
  },
};

// Adds a volume mount to a container.
local volumeMount(name, path) = container.volumeMounts(container.volumeMountsType.new(name, path, true));

// Adds a secret volume to a deployment.
local secretVolume(name, secretName) = volumes(volume.name(name) + volume.mixin.secret.secretName(secretName));

local repoName = 'asia.gcr.io/crucial-media-167709/talk-tracker';
local host = 'talks.dev.helixta.com.au';

local talkTracker = {
  name:: 'talk-tracker',
  imageVersion:: 'v1',
  projectId:: 'crucial-media-167709',
  host:: host,
  labels:: {app: $.name},
  useTls:: true,
  namespace:: $.name,

  // Resource requests / limits. Memory is request+limit, but CPU is just request.
  memory:: '50Mi',
  cpu:: '50m',

  local appServer =
    container.new('talk-tracker', repoName + ':' + $.imageVersion) +
    container.command("/talk-tracker") +
    container.args(['-projectId', $.projectId]) +
    container.args(['-namespace', $.namespace]) +
    container.ports(container.portsType.newNamed("http", 1234)) +
    container.mixin.resources.limits({
      memory: $.memory,
    }) +
    container.mixin.resources.requests({
      cpu: $.cpu,
      memory: $.memory,
    }) +
    volumeMount('google-cloud-key', '/var/secrets/google') +
    container.env(container.envType.new('GOOGLE_APPLICATION_CREDENTIALS', '/var/secrets/google/key.json')) +
    container.env(container.envType.new('BASIC_AUTH_USER', 'talks')) +
    container.env(container.envType.fromSecretRef('BASIC_AUTH_PASS', 'talk-tracker-password', 'password')) +
    container.imagePullPolicy('Always'),


  local ttDeployment = deployment.new($.name, 1, [appServer], $.labels) +
    secretVolume('google-cloud-key', 'talk-tracker-key'),

  local ttIngress = ingress.new() +
    ingress.mixin.metadata.name($.name) +
    ingress.mixin.metadata.labels($.labels) +
    ingress.mixin.metadata.annotations({
      "kubernetes.io/ingress.class": "nginx",
      "kubernetes.io/tls-acme": if $.useTls then "true" else "false",
    }) +
    ingress.mixin.spec.rules([ingressRule($.host, '/', $.name, 80)]) +
    if $.useTls then
      ingress.mixin.spec.tls([
        {
          hosts: [$.host],
          secretName: $.name + '-tls',
        },
      ])
    else {},

  local ttService = service.new($.name, $.labels, [
    service.mixin.spec.portsType.new(80, 1234)
  ]),

  result: k.core.v1.list.new([ttDeployment, ttIngress, ttService])
};

talkTracker