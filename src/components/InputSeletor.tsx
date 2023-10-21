import { useReducer } from "react";
import Decimal from 'decimal.js';

type InputSeletorProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  labelUp?: string;
  labelDown?: string;
  formatter: ((value: number) => string) | null;
};

type State = {
    value: Decimal;
    min: Decimal;
    max: Decimal;
    step?: Decimal;
  };

type Action = {
  type: 'valor-posterior' | 'valor-anterior';
};

function reducer(state: State, action: Action){

    switch (action.type) {
      case 'valor-anterior': {
        const newValue = state.value.minus(state.step || 1);
        const isValid = newValue.greaterThanOrEqualTo(state.min);
        return {
          ...state,
          value: isValid ? newValue : state.value,
        };
      }

      case 'valor-posterior': {
        const newValue = state.value.plus(state.step || 1);
        const isValid = newValue.lessThanOrEqualTo(state.max);
        return {
          ...state,
          value: isValid ? newValue : state.value,
        };
      }

      default:
        return state;
    }
}

export default function InputSeletor(props: InputSeletorProps){
    const [state, dispatch] = useReducer(reducer, null, () => {
        const {labelUp, labelDown, formatter, ...initialNumberState } = props;
        const initialState = Object.fromEntries(
            Object.entries(initialNumberState).map(([key, value]) => {
            return typeof value === 'number' 
                ? [key, new Decimal(value)] 
                : [key, value];
        }));
        return initialState as State;
    });

    return (
      <div className="flex flex-col items-center justify-center">
        {props.labelUp && <span>{props.labelUp}</span>}
        <button
          className="w-full h-6 flex items-center justify-center after:absolute after:w-2 after:h-2 after:border-gray-900 after:border-t-2 after:border-l-2 after:rotate-45 after:translate-y-1"
          onClick={() => dispatch({ type: 'valor-posterior' })}
        />
        <div className="w-24 h-10 px-2 flex flex-col items-center justify-center text-2xl">
          {props.formatter ? props.formatter(Number(state.value)) : state.value.toString()}
        </div>
        <button
          className="w-full h-6 flex items-center justify-center after:absolute after:w-2 after:h-2 after:border-gray-900 after:border-b-2 after:border-r-2 after:rotate-45 after:-translate-y-1"
          onClick={() => dispatch({ type: 'valor-anterior' })}
        />
        {props.labelDown && <span>{props.labelDown}</span>}
      </div>
    );
}