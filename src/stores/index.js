import _ from 'lodash'
import fs from './stores.fs'
import s3 from './stores.s3'

export async function getStoreFromHook (hook, hookName, storePath) {
  // First try specific hook data
  let store = _.get(hook, storePath || 'data.store')
  if (store) {
    store = await hook.service.storesService.get(typeof store === 'object' ? store.id : store)
  } else {
    // Check if store object already provided as global parameter
    store = hook.params.store
  }
  if (!store) {
    throw new Error(`Cannot find store for hook ${hookName}.`)
  }

  return store
}

export async function getStoreFromService (storesService, params, data) {
  // First try specific service data
  let { store } = data
  // Store config given
  if (store) {
    try {
      // Check if store does not already exist
      store = await storesService.get(typeof store === 'object' ? store.id : store)
    } catch (error) {
      // If not create it the first time
      store = await storesService.create(store)
    }
  } else {
    // Check if store object already provided as global parameter
    store = params.store
  }

  return store
}

export default {
  fs,
  s3
}
