import { useState, useCallback }  from  '@tarojs/taro'
import { createContainer } from "../../unstated-next"

function useCounter(initialState = 0) {
    let [count, setCount] = useState(initialState)

    let decrement = useCallback(() => setCount(count => count - 1), [])
    let increment = useCallback(() => setCount(count => count + 1), [])

    return { count, decrement, increment }
}

const CounterContainer = createContainer(useCounter);
export default CounterContainer
