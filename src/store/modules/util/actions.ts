import { ActionTree } from "vuex"
import RootState from "@/store/RootState"
import UtilState from "./UtilState"
import logger from "@/logger"
import { hasError } from "@/utils"
import * as types from "./mutation-types"
import { UtilService } from "@/services/UtilService"
import { EnumerationAndType } from "@/types"
import store from "@/store"

const actions: ActionTree<UtilState, RootState> = {
  async fetchEnums({ commit, state }, payload) {
    let enums = {
      ...state.enums
    }

    try {
      const resp = await UtilService.fetchEnums(payload);

      if(!hasError(resp) && resp.data.length) {
        enums = resp.data.reduce((enumerations: any, data: EnumerationAndType) => {
          if(enumerations[data.enumTypeId]) {
            enumerations[data.enumTypeId][data.enumId] = data
          } else {
            enumerations[data.enumTypeId] = {
              [data.enumId]: data
            }
          }
          return enumerations
        }, enums)
      }
    } catch(err) {
      logger.error('error', err)
    }

    commit(types.UTIL_ENUMS_UPDATED, enums)
  },

  async fetchFacilities({ commit, state }) {
    let facilities = JSON.parse(JSON.stringify(state.facilities))

    // Do not fetch facilities if already available
    if(Object.keys(facilities).length) {
      return;
    }

    const payload = {
      parentTypeId: "VIRTUAL_FACILITY"
    }

    try {
      const resp = await UtilService.fetchFacilities(payload);

      if(!hasError(resp) && resp.data.length) {
        facilities = resp.data.reduce((facilities: any, facility: any) => {
          facilities[facility.facilityId] = facility
          return facilities
        }, {})
      }
    } catch(err) {
      logger.error('error', err)
    }

    commit(types.UTIL_FACILITIES_UPDATED, facilities)
  },

  async fetchShippingMethods({ commit, state }) {
    let shippingMethods = JSON.parse(JSON.stringify(state.shippingMethods))

    // Do not fetch shipping methods if aleady available
    if(Object.keys(shippingMethods).length) {
      return;
    }

    const payload = {
      productStoreId: store.state.user.currentEComStore.productStoreId
    }

    try {
      const resp = await UtilService.fetchShippingMethods(payload);

      if(!hasError(resp) && resp.data.length) {
        shippingMethods = resp.data.reduce((shippingMethods: any, shippingMethod: any) => {
          shippingMethods[shippingMethod.shipmentMethodTypeId] = shippingMethod
          return shippingMethods
        }, {})
      }
    } catch(err) {
      logger.error('error', err)
    }

    commit(types.UTIL_SHIPPING_METHOD_UPDATED, shippingMethods)
  },

  async fetchFacilityGroups({ commit, state }) {
    let facilityGroups = JSON.parse(JSON.stringify(state.facilityGroups))

    // Do not fetch groups again if already available
    if(Object.keys(facilityGroups).length) {
      return;
    }

    const payload = {
      productStoreId: store.state.user.currentEComStore.productStoreId,
      facilityGroupTypeId: "BROKERING_GROUP"
    }

    try {
      const resp = await UtilService.fetchFacilityGroups(payload);

      if(!hasError(resp) && resp.data.length) {
        facilityGroups = resp.data.reduce((facilityGroups: any, facilityGroup: any) => {
          facilityGroups[facilityGroup.facilityGroupId] = facilityGroup
          return facilityGroups
        }, {})
      }
    } catch(err) {
      logger.error('error', err)
    }

    commit(types.UTIL_FACILITY_GROUP_UPDATED, facilityGroups)
  }
}

export default actions;