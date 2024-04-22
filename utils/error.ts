import { NeoMessageVariant } from '@kodadot1/brick'
import { DispatchError } from '@polkadot/types/interfaces'
import { notificationTypes, showNotification } from '@/utils/notification'
import camelCase from 'lodash/camelCase'

export const MODULE_ERRORS_CONFIG: Record<
  string,
  { level: NeoMessageVariant; reportable: boolean }
> = {
  NoPermission: {
    level: 'danger',
    reportable: true,
  },
  UnknownCollection: {
    level: 'danger',
    reportable: false,
  },
  AlreadyExists: {
    level: 'danger',
    reportable: true,
  },
  ApprovalExpired: {
    level: 'warning',
    reportable: false,
  },
  WrongOwner: {
    level: 'danger',
    reportable: true,
  },
  BadWitness: {
    level: 'danger',
    reportable: false,
  },
  CollectionIdInUse: {
    level: 'danger',
    reportable: false,
  },
  ItemsNonTransferable: {
    level: 'danger',
    reportable: false,
  },
  NotDelegate: {
    level: 'danger',
    reportable: false,
  },
  WrongDelegate: {
    level: 'danger',
    reportable: true,
  },
  Unapproved: {
    level: 'danger',
    reportable: false,
  },
  Unaccepted: {
    level: 'danger',
    reportable: true,
  },
  ItemLocked: {
    level: 'danger',
    reportable: false,
  },
  LockedItemAttributes: {
    level: 'danger',
    reportable: false,
  },
  LockedCollectionAttributes: {
    level: 'danger',
    reportable: false,
  },
  LockedItemMetadata: {
    level: 'danger',
    reportable: false,
  },
  LockedCollectionMetadata: {
    level: 'danger',
    reportable: false,
  },
  MaxSupplyReached: {
    level: 'warning',
    reportable: false,
  },
  MaxSupplyLocked: {
    level: 'warning',
    reportable: false,
  },
  MaxSupplyTooSmall: {
    level: 'warning',
    reportable: false,
  },
  UnknownItem: {
    level: 'danger',
    reportable: false,
  },
  UnknownSwap: {
    level: 'danger',
    reportable: true,
  },
  MetadataNotFound: {
    level: 'warning',
    reportable: false,
  },
  AttributeNotFound: {
    level: 'danger',
    reportable: true,
  },
  NotForSale: {
    level: 'warning',
    reportable: false,
  },
  BidTooLow: {
    level: 'danger',
    reportable: false,
  },
  ReachedApprovalLimit: {
    level: 'danger',
    reportable: false,
  },
  DeadlineExpired: {
    level: 'warning',
    reportable: false,
  },
  WrongDuration: {
    level: 'warning',
    reportable: false,
  },
  MethodDisabled: {
    level: 'warning',
    reportable: false,
  },
  WrongSetting: {
    level: 'warning',
    reportable: false,
  },
  InconsistentItemConfig: {
    level: 'warning',
    reportable: true,
  },
  NoConfig: {
    level: 'warning',
    reportable: true,
  },
  RolesNotCleared: {
    level: 'warning',
    reportable: true,
  },
  MintNotStarted: {
    level: 'danger',
    reportable: false,
  },
  MintEnded: {
    level: 'danger',
    reportable: false,
  },
  AlreadyClaimed: {
    level: 'danger',
    reportable: false,
  },
  IncorrectData: {
    level: 'danger',
    reportable: true,
  },
  WrongOrigin: {
    level: 'danger',
    reportable: true,
  },
  WrongSignature: {
    level: 'danger',
    reportable: true,
  },
  IncorrectMetadata: {
    level: 'warning',
    reportable: false,
  },
  MaxAttributesLimitReached: {
    level: 'warning',
    reportable: false,
  },
  WrongNamespace: {
    level: 'danger',
    reportable: true,
  },
  CollectionNotEmpty: {
    level: 'danger',
    reportable: true,
  },
  WitnessRequired: {
    level: 'danger',
    reportable: false,
  },
}

const extractErrorMetadata = async (dispatchError: DispatchError) => {
  const { apiInstance } = useApi()
  const api = await apiInstance.value

  const { name, docs, section } = api.registry.findMetaError(
    dispatchError.asModule,
  )

  return {
    key: `${section}.${name}`,
    name,
    description: docs.join(' '),
    section,
  }
}

export const notifyDispatchError = async (
  dispatchError: DispatchError,
): Promise<void> => {
  if (!dispatchError.isModule) {
    warningMessage(dispatchError.toString())
    return
  }

  const { $i18n } = useNuxtApp()
  const { name, description, key } = await extractErrorMetadata(dispatchError)

  const config = MODULE_ERRORS_CONFIG[name] ?? undefined
  const action =
    !config || config.reportable
      ? getReportIssueAction(`${key}: ${description}`)
      : undefined

  showNotification({
    ...(config
      ? {
          title: $i18n.t(`errors.${camelCase(name)}.name`),
          message: $i18n.t(`errors.${camelCase(name)}.description`),
        }
      : { title: name, message: description }),
    action: action,
    params: notificationTypes[config?.level] ?? notificationTypes.warn,
  })
}
