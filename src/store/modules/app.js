const state = {
  sidebar: {
    opened: false
  },
  logout: false,
  retrieval: ""
};

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened;
  },
  TOGGLE_LOGOUT: state => {
    state.logout = !state.logout;
  },
  TOGGLE_RETRIEVAL: (state, value) => {
    state.retrieval = value
  }
};

const actions = {
  toggleSideBar ({ commit }) {
    commit("TOGGLE_SIDEBAR");
  },
  toggleLogout ({ commit }) {
    commit("TOGGLE_LOGOUT");
  },
  toggleRetrieval ({ commit }, value) {
    commit("TOGGLE_RETRIEVAL", value)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
