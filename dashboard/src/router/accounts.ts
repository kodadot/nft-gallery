import { apiEnabled } from '@/routeGuard';

const Accounts = () => import(/* webpackChunkName:'accounts' */ '@/views/Accounts.vue');
const AccountsCreate = () => import(/* webpackChunkName:'accounts' */ '@/views/AccountsCreate.vue');
const AccountsBackup = () => import(/* webpackChunkName:'accounts' */ '@/views/AccountsBackup.vue');
const AccountsChangePassword = () => import(/* webpackChunkName:'accounts' */ '@/views/AccountsChangePassword.vue');
const AccountsRestore = () => import(/* webpackChunkName:'accounts' */ '@/views/AccountsRestore.vue');
const AddressbookCreate = () => import(/* webpackChunkName:'accounts' */ '@/views/AddressbookCreate.vue');


export default [
  {
    path: '/accounts/0',
    name: 'accounts',
    component: Accounts,
    // beforeEnter: apiEnabled,
    children: [
      {
        path: 'create',
        name: 'accountsCreate',
        component: AccountsCreate,
        // beforeEnter: apiEnabled,
      },
      {
        path: 'backup/:address',
        name: 'accountsBackup',
        component: AccountsBackup,
        // beforeEnter: apiEnabled,
      },
      {
        path: 'changepassword/:address',
        name: 'accountsChangePassword',
        component: AccountsChangePassword,
        beforeEnter: apiEnabled,
      },
      {
        path: 'restore',
        name: 'accountsRestore',
        component: AccountsRestore,
        // beforeEnter: apiEnabled,
      },
      ]
  },
  {
    path: '/accounts/1',
    name: 'addressbook',
    component: Accounts,
    // beforeEnter: apiEnabled,
    children: [
      {
        path: 'create',
        name: 'addressbookCreate',
        component: AddressbookCreate,
        beforeEnter: apiEnabled,
      }

    ]
  },
      
]