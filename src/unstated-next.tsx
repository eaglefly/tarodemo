import Taro from "@tarojs/taro"

export interface ContainerProviderProps<State = void> {
  initialState?: State
  children:any
}

export function createContainer<Value, State = void>(
  useHook: (initialState?: State) => Value,
): { useContainer: () => Value; Provider: (props: ContainerProviderProps<State>) => any } {
  let Context = Taro.createContext<Value | null>(null)

  function Provider(props: ContainerProviderProps<State>) {
    let value = useHook(props.initialState);
    return <Context.Provider value={value}>{props.children}</Context.Provider>
  }

  // eslint-disable-next-line no-shadow
  function useContainer(): Value {
    let value = Taro.useContext(Context);
    if (value === null) {
      throw new Error("Component must be wrapped with <Container.Provider>")
    }
    return value;
  }

  return { Provider, useContainer }
}

export function useContainer<Value, State = void>(
  container: { useContainer: () => Value; Provider: (props: ContainerProviderProps<State>) => any }
): Value {
  return container.useContainer()
}
