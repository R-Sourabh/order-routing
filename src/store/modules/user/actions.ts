import { UserService } from "@/services/UserService"
import { ActionTree } from "vuex"
import RootState from "@/store/RootState"
import UserState from "./UserState"
import * as types from "./mutation-types"
import { hasError, showToast } from "@/utils"
import { translate } from "@/i18n"
import logger from "@/logger"
import emitter from "@/event-bus"
import store from "@/store"

const actions: ActionTree<UserState, RootState> = {

  /**
  * Login user and return token
  */
  async login({ commit }, { username, password }) {
    try {
      if(!username.length || !password.length) {
        return Promise.reject('')
      }

      emitter.emit("presentLoader", { message: "Logging in...", backdropDismiss: false })
      // TODO: implement support for permission check
      const token = await UserService.login(username, password)

      const userProfile = await UserService.getUserProfile(token);

      // TODO: fetch only associated product stores for user, currently api does not support this
      userProfile.stores = await UserService.getEComStores(token);

      commit(types.USER_TOKEN_CHANGED, { newToken: token })
      commit(types.USER_INFO_UPDATED, userProfile);
      commit(types.USER_CURRENT_ECOM_STORE_UPDATED, userProfile.stores.length ? userProfile.stores[0] : {});
      emitter.emit("dismissLoader")
      return Promise.resolve({ token })
    } catch (err: any) {
      emitter.emit("dismissLoader")
      showToast(translate(err));
      logger.error("error", err);
      return Promise.reject(new Error(err))
    }
  },

  /**
  * Logout user
  */
  async logout({ commit }) {
    // TODO add any other tasks if need
    commit(types.USER_END_SESSION)
    this.dispatch("orderRouting/clearRouting")
    this.dispatch("util/clearUtilState")
  },
  
  /**
  * Update user timeZone
  */
  async setUserTimeZone({ state, commit }, payload) {
    const resp = await UserService.setUserTimeZone(payload)
    if (resp.status === 200 && !hasError(resp)) {
      const current: any = state.current;
      current.userTimeZone = payload.tzId;
      commit(types.USER_INFO_UPDATED, current);
      showToast(translate("Time zone updated successfully"));
    }
  },

  /**
  * Set User Instance Url
  */
  setUserInstanceUrl({ commit }, payload) {
    commit(types.USER_INSTANCE_URL_UPDATED, payload)
  },

  setEcomStore({ commit, state }, payload) {
    let productStore = payload.productStore;
    if(!productStore) {
      productStore = (state.current as any).stores.find((store: any) => store.productStoreId === payload.productStoreId);
    }
    commit(types.USER_CURRENT_ECOM_STORE_UPDATED, productStore);
  }
}

export default actions;