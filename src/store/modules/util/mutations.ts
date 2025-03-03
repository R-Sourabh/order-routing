import { MutationTree } from "vuex"
import UtilState from "./UtilState"
import * as types from "./mutation-types"

const mutations: MutationTree<UtilState> = {
  [types.UTIL_ENUMS_UPDATED](state, payload) {
    state.enums = payload
  },
  [types.UTIL_FACILITIES_UPDATED](state, payload) {
    state.facilities = payload
  },
  [types.UTIL_SHIPPING_METHOD_UPDATED](state, payload) {
    state.shippingMethods = payload
  },
  [types.UTIL_FACILITY_GROUP_UPDATED](state, payload) {
    state.facilityGroups = payload
  },
  [types.UTIL_OMS_CONNECTION_STATUS_UPDATED](state, payload) {
    state.isOmsConnectionExist = payload
  },
  [types.UTIL_CLEARED](state) {
    state.enums = {}
    state.facilities = {}
    state.shippingMethods = {}
    state.facilityGroups = {}
    state.isOmsConnectionExist = undefined
    state.statuses = {}
    state.carriers = {}
  },
  [types.UTIL_STATUSES_UPDATED](state, payload) {
    state.statuses = payload
  },
  [types.UTIL_CARRIERS_UPDATED](state, payload) {
    state.carriers = payload
  }
}
export default mutations;