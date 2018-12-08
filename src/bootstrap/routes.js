export default [{
  path: '/',
  name: 'root',
  component: () => import('@/apps/views/App'),
}, {
  path: '/app/:appId',
  name: 'app',
  component: () => import('@/apps/views/App'),
}];
