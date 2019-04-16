export const appAnonymousNavigation = [
  {
    name: 'Login',
    url: '/login',
    icon: 'icon-login'
  }
];

export const appNavigation = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    icon: 'icon-chart'
  },
  {
    name: 'Reports',
    url: '/reports',
    icon: 'icon-graph'
  },
  {
    name: 'Network Maps',
    url: '/network-maps',
    icon: 'icon-map'
  },
  {
    name: 'Devices',
    url: '/devices',
    icon: 'icon-list'
  },
  {
    name: 'Notifications',
    url: '/notifications',
    icon: 'icon-speech'
  },
  {
    name: 'Alerts',
    url: '/alerts',
    icon: 'icon-bubble',
    toggle: 'alerts',
    children: [
      {
        name: 'Groups',
        icon: 'icon-people',
        url: '/alerts/groups'
      },
      {
        name: 'Alerts',
        icon: 'icon-bubble',
        url: '/alerts/alerts'
      }
    ]
  },
  {
    name: 'Vendors',
    url: '/vendors',
    icon: 'icon-people'
  },
  {
    name: 'Support',
    url: '/support-cases',
    icon: 'icon-briefcase'
  },
  {
    name: 'Admin',
    url: '/admin',
    icon: 'icon-lock',
    userGroup: 'Billing',
    children: [
      {
        name: 'Billing',
        icon: 'icon-credit-card',
        url: '/admin/billing',
        userGroup: 'Billing',
      },
    ]
  },
  {
    name: 'Settings',
    url: '/settings',
    icon: 'icon-settings',
    children: [
      {
        name: 'Backups',
        icon: 'icon-settings',
        url: '/settings/backups'
      },
      {
        name: 'SNMP',
        icon: 'icon-settings',
        url: '/settings/snmp'
      }
    ]
  }
];
