import Vue from 'vue'
export const EventBus = new Vue()

export enum COMMON_EVENTS {
  RESET_SEARCH_PAGE = 'RESET_SEARCH_PAGE',
}
