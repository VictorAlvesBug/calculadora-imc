import { useState, Dispatch, SetStateAction } from "react";

export default function useStateWithValidation<T>(
    initialState: T | (() => T),
    validation: (prevState: T) => boolean
): [T, Dispatch<SetStateAction<T>>] {
    const [state, setState] = useState(initialState);

    const setStateWithValidation: Dispatch<SetStateAction<T>> = (newState: SetStateAction<T>) => {
        const resolvedState = 
            (typeof newState === 'function') 
            ? (newState as (prevState: T) => T)(state) 
            : newState;
        if(validation(resolvedState)){
            setState(resolvedState);
            return true;
        }

        console.error(`Erro: O valor "${resolvedState}" não é válido!`);
        return false;
    }

    return [state, setStateWithValidation];
}