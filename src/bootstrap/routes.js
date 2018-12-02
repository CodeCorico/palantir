export default [{
  path: '/',
  name: 'root',
  component: () => import('@/layouts/views/App'),
}, {
  path: '/app/:appId',
  name: 'app',
  component: () => import('@/layouts/views/App'),
}];
