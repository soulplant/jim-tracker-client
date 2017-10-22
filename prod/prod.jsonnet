local k = import "./ksonnet-lib/ksonnet.beta.2/k.libsonnet";
local deployment = k.apps.v1beta1.deployment;
local volumes = deployment.mixin.spec.template.spec.volumes;
local volume = deployment.mixin.spec.template.spec.volumesType;
local container = deployment.mixin.spec.template.spec.containersType;
local service = k.core.v1.service;

local ttService = service.new('talk-tracker', {app: 'talk-tracker'}, [
  service.mixin.spec.portsType.new(80, 1234)
]);

local ingress = k.extensions.v1beta1.ingress;

// Adds a volume mount to a container.
local volumeMount(name, path) = container.volumeMounts(container.volumeMountsType.new(name, path, true));

// Adds a secret volume to a deployment.
local secretVolume(name, secretName) = volumes(volume.name(name) + volume.mixin.secret.secretName(secretName));

local imageName = 'asia.gcr.io/crucial-media-167709/talk-tracker:v1';

local appServer =
  container.new('talk-tracker', imageName) +
  container.command("/talk-tracker") +
  container.args(['-projectId', 'crucial-media-167709']) +
  container.ports(container.portsType.newNamed("http", 1234)) +
  volumeMount('google-cloud-key', '/var/secrets/google') +
  container.env(container.envType.new('GOOGLE_APPLICATION_CREDENTIALS', '/var/secrets/google/key.json')) +
  container.env(container.envType.new('BASIC_AUTH_USER', 'talks')) +
  container.env(container.envType.fromSecretRef('BASIC_AUTH_PASS', 'talk-tracker-password', 'password')) +
  container.imagePullPolicy('Always');


local ttDeployment = deployment.new('talk-tracker', 1, [appServer], {app: 'talk-tracker'}) +
  secretVolume('google-cloud-key', 'talk-tracker-key');

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

local ttIngress = ingress.new() +
  ingress.mixin.metadata.name('talk-tracker') +
  ingress.mixin.spec.rules(
    [
      ingressRule('talks.dev.helixta.com.au', '/', 'talk-tracker', 80),
    ]
  );

k.core.v1.list.new([ttDeployment, ttIngress, ttService])