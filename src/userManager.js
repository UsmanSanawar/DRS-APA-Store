
import { makeUserManager } from 'react-oidc'


const userManagerConfig = {
  client_id: 'web-client',
  redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/#/callback#`,
  response_type: 'code',
  scope: 'openid profile roles',
  // authority: 'https://localhost:44330',
  authority: 'https://drsapa.ddns.net',
  silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/#/callback#`,
  post_logout_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/#/callback#`,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: true,
  revokeAccessTokenOnSignout: true,
  crossorigin: '*'
};

const userManager = makeUserManager(userManagerConfig)

export default userManager;