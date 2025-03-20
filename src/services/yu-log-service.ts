export class YuLogService {
  
  static LOG_PREFIX = "yutumu:";

  static log(message: string): void {
    console.log(`${YuLogService.LOG_PREFIX} ${message}`);
  }

  static error(message: string): void {
    console.error(`${YuLogService.LOG_PREFIX} ${message}`);
  }

  static warn(message: string): void {
    console.warn(`${YuLogService.LOG_PREFIX} ${message}`);
  }
}
