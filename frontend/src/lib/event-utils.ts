export type EventHandler<TArgs extends any[]> = {
  (...args: TArgs): void;
  add: (callback: (...args: TArgs) => void) => void;
};

export function createEvent<TArgs extends any[]>(): EventHandler<TArgs> {
  var invokeList: ((...args: TArgs) => void)[] = [];

  var event = function (this: void, ...args: TArgs) {
    for (var i = 0; i < invokeList.length; i++) {
      invokeList[i](...args);
    }
  } as EventHandler<TArgs>;

  event.add = function (callback: (...args: TArgs) => void) {
    invokeList.push(callback);
  };

  return event;
}
