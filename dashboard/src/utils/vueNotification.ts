import Vue from 'vue'

/**
 * NotificationService for vue
 * @example
 * // Show success message
 * NS.success('Success')
 * @example
 * // Show info message
 * NS.info('This is info message');
 */
class NotificationService extends Vue {
  private snackbarTypes: any = {
    success: {
      type: 'is-success',
      actionText: 'View',
    },
    info: {
      type: 'is-info',
      actionText: 'OK',
    },
    danger: {
      type: 'is-danger',
      actionText: 'Oh no!',
    },
  };

  private success(message: string | null, params?: any) {
    this.showNotification(message, { ...this.snackbarTypes.success, ...params })
  }

  private info(message: string | null, params?: any) {
    this.showNotification(message, { ...this.snackbarTypes.info, ...params })
  }

  private danger(message: string | null, params?: any) {
    this.showNotification(message, { ...this.snackbarTypes.danger, ...params })
  }

  private showNotification(message: string | null, params = this.snackbarTypes.info) {
    this.$buefy.snackbar.open({
      duration: 10000,
      message,
      type: 'is-success',
      position: 'is-top-right',
      actionText: 'OK',
      queue: false,
      ...params,
    });
  }

}


const bus = new NotificationService();
export default bus
