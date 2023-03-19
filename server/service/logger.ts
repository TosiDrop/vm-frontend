export namespace LoggerService {
  export function warn(text: string) {
    console.warn(`WARNING: ${text}`);
  }

  export function error(text: string) {
    console.error(`ERROR: ${text}`);
  }

  export function log(text: string) {
    console.error(`LOG: ${text}`);
  }
}
