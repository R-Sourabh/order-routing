import { GetterTree } from "vuex"
import UtilState from "./UtilState"
import RootState from "@/store/RootState"

const getters: GetterTree<UtilState, RootState> = {
  getEnums(state) {
    return state.enums
  },
  getFacilities(state) {
    return state.facilities
  },
  getVirtualFacilities(state) {
    return Object.values(state.facilities).reduce((virtualFacilities: any, facility: any) => {
      if(facility.parentTypeId === "VIRTUAL_FACILITY") {
        virtualFacilities[facility.facilityId] = facility
      }
      return virtualFacilities;
    }, {})
  },
  getPhysicalFacilities(state) {
    return Object.values(state.facilities).reduce((virtualFacilities: any, facility: any) => {
      if(facility.parentTypeId !== "VIRTUAL_FACILITY") {
        virtualFacilities[facility.facilityId] = facility
      }
      return virtualFacilities;
    }, {})
  },
  getShippingMethods(state) {
    return state.shippingMethods
  },
  getFacilityGroups(state) {
    return state.facilityGroups
  },
  isOmsConnectionExist(state) {
    return state.isOmsConnectionExist
  },
  getStatusDesc: (state) => (id: any) => {
    return state.statuses[id]?.description ? state.statuses[id]?.description : id
  },
  getCarriers(state) {
    return state.carriers
  }
}

export default getters;