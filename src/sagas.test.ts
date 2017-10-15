import { Action, applyMiddleware, compose, createStore } from "redux";
import { call, put, takeEvery } from "redux-saga/effects";

import createSagaMiddleware from "redux-saga";

export type Stublet<T> = {
  original: T;
  resolve(value?: any): void;
  reject(value?: any): void;
};

export type Stub<T> = T & { [P in keyof T]: Stublet<T[P]> };

export function makeStub<T>(obj: T): Stub<T> {
  let result = {};
  Object.keys(obj).forEach(key => {
    function wrapper(...args: any[]): any {
      const promise = new Promise((resolve, reject) => {
        wrapper["resolve"] = resolve;
        wrapper["reject"] = reject;
      });
      wrapper["promise"] = promise;
      return promise;
    }

    wrapper["original"] = obj[key];

    result[key] = wrapper;
  });
  return result as Stub<T>;
}

describe("stuff", () => {
  it("works", async () => {
    let fooDone = false;
    let barDone = false;

    const foo = makeStub({
      foo(): Promise<void> {
        throw "not implemented";
      },
      bar(): Promise<void> {
        throw "not implemented";
      },
    });

    foo
      .foo()
      .then(() => {
        fooDone = true;
        return foo.bar();
      })
      .then(() => {
        barDone = true;
      });

    expect(fooDone).toBe(false);
    expect(barDone).toBe(false);
    // Bar hasn't been called yet, so can't be resolved.
    expect(foo.bar.resolve).toBeUndefined();
    // Foo has though, so should be ready to be resolved.
    expect(foo.foo.resolve).toBeDefined();
    foo.foo.resolve();
    await delay();
    expect(fooDone).toBe(true);
    expect(barDone).toBe(false);
    expect(foo.bar.resolve).toBeDefined();
    foo.bar.resolve();
    await delay();
    expect(fooDone).toBe(true);
    expect(barDone).toBe(true);
  });
});

describe("test sagas", () => {
  it("stuff", async () => {
    const sagaMiddleware = createSagaMiddleware();

    const reducer = (
      state: string | undefined = "",
      action: Action
    ): string | undefined => {
      return action.type;
    };

    const store = createStore(
      reducer,
      compose(applyMiddleware(sagaMiddleware))
    );

    const api = {
      doSomething(): Promise<boolean> {
        throw "not implemented";
      },
    };

    type Api = typeof api;

    function* callServer(api: Api) {
      const result = yield call([api, api.doSomething]);
      if (result) {
        yield put({ type: "TRUE" });
      } else {
        yield put({ type: "FALSE" });
      }
    }

    const mockApi = makeStub(api);
    sagaMiddleware.run(function*(api: Api) {
      yield takeEvery("START", callServer, api);
    }, mockApi);

    store.dispatch({ type: "START" });
    expect(store.getState()).toBe("START");
    mockApi.doSomething.resolve(true);
    await delay();
    expect(store.getState()).toBe("TRUE");
  });
});

function delay(): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve);
  });
}
