export default class LogGL {
  public static ENABLED: boolean = true;

  public static log(...messages: any[]) {
    if (!LogGL.ENABLED) {
      return;
    }
    console.log(messages);
  }

  public static error(...messages: any[]) {
    if (!LogGL.ENABLED) {
      return;
    }
    console.error(messages);
    console.trace();
  }

  private static _screenLogDiv: HTMLDivElement;

  public static getScreenLogDiv(): HTMLDivElement {
    if (!LogGL._screenLogDiv) {
      LogGL._screenLogDiv = LogGL.createDebugDiv();
    }
    return LogGL._screenLogDiv;
  }

  public static logToScreen(html: string) {
    if (!LogGL.ENABLED) {
      return;
    }
    if (!LogGL._screenLogDiv) {
      LogGL._screenLogDiv = LogGL.createDebugDiv();
    }
    LogGL._screenLogDiv.innerHTML = html;
  }

  public static logAppendToScreen(html: string) {
    if (!LogGL.ENABLED) {
      return;
    }
    if (!LogGL._screenLogDiv) {
      LogGL._screenLogDiv = LogGL.createDebugDiv();
    }
    LogGL._screenLogDiv.innerHTML += html;
  }

  public static logArray(array: number[]) {
    if (!LogGL.ENABLED) {
      return;
    }

    const l: number = array.length;
    let str: string = '';
    for (let i = 0; i < l; i++) {
      str += array[i];
      str += ',';
    }
    str = str.substring(0, str.length - 1);
    console.log(str);
  }

  public static log2dArray(array: number[][]) {
    if (!LogGL.ENABLED) {
      return;
    }

    const l: number = array.length;
    let str: string = '';
    for (let i = 0; i < l; i++) {
      for (let j = 0; j < array[i].length; j++) {
        str += array[i][j];
        str += ',';
      }
    }
    str = str.substring(0, str.length - 1);
    console.log(str);
  }

  private static createDebugDiv(): HTMLDivElement {
    const debugDiv = document.createElement('div');
    document.body.appendChild(debugDiv);
    debugDiv.style.position = 'absolute';
    debugDiv.style.left = '160px';
    debugDiv.style.top = '0px';
    debugDiv.style.color = '#fff';
    debugDiv.style.backgroundColor = '#000';
    debugDiv.style.display = 'block';
    debugDiv.style.width = '158px';
    debugDiv.style.height = '94px';
    debugDiv.style.padding = '1px';
    debugDiv.style.font = '10px Helvetica,Arial,sans-serif';
    debugDiv.style.lineHeight = '14px';
    debugDiv.style.zIndex = '1000';

    return debugDiv;
  }
}
