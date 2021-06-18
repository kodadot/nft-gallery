import { apiEnabled } from '@/routeGuard';

const Accounts = () => import(/* webpackChunkName:'accounts' */ '@/views/accounts/Accounts.vue');
const AccountsCreate = () => import(/* webpackChunkName:'accounts' */ '@/views/accounts/AccountsCreate.vue');
const AccountsBackup = () => import(/* webpackChunkName:'accounts' */ '@/views/accounts/AccountsBackup.vue');
const AccountsChangePassword = () => import(/* webpackChunkName:'accounts' */ '@/views/accounts/AccountsChangePassword.vue');
const AccountsRestore = () => import(/* webpackChunkName:'accounts' */ '@/views/accounts/AccountsRestore.vue');
const AddressbookCreate = () => import(/* webpackChunkName:'accounts' */ '@/views/accounts/AddressbookCreate.vue');

const AccountsDefault = () => import(/* webpackChunkName:'accounts' */ '@/components/accounts/Accounts.vue');
const AddressbookDefault = () => import(/* webpackChunkName:'accounts' */ '@/components/addressbook/Addressbook.vue');


export default [
  {
    path: '/accounts/0',

    component: Accounts,
    // beforeEnter: apiEnabled,
    children: [
      {
        path: '',
        name: 'accounts',
        component: AccountsDefault,
        // beforeEnter: apiEnabled,
      },
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

    component: Accounts,
    // beforeEnter: apiEnabled,
    children: [
      {
        path: '',
        name: 'addressbook',
        component: AddressbookDefault,
        // beforeEnter: apiEnabled,
      },
      {
        path: 'create',
        name: 'addressbookCreate',
        component: AddressbookCreate,
        beforeEnter: apiEnabled,
      }

    ]
  },

]
