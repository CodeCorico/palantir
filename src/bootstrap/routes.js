export default [{
  path: '/app/:appId/:appLocalRoute*',
  name: 'app',
  component: () => import('@/apps/views/App'),
}, {
  path: '/:appLocalRoute*',
  name: 'root',
  component: () => import('@/apps/views/App'),
}];
