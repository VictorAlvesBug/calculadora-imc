import { useEffect, useLayoutEffect, useReducer } from 'react';
import Decimal from 'decimal.js';

type InputSeletorProps = {
  className?: string;
  onChange?: (value: number) => void;
  value: number;
  min: number;
  max: number;
  step?: number;
  labelUp?: string;
  labelDown?: string;
  formatter: ((value: number) => string) | null;
};

enum UPDATING_CLASS { 
  'adding' = 'flex-col-reverse transition-all translate-y-[100%]',
  'added' = 'flex-col-reverse translate-y-[0%]',
  'subtracting' = 'flex-col transition-all translate-y-[-100%]',
  'subtracted' = 'flex-col translate-y-[0%]'
}

type State = {
  value: Decimal;
  prevValue: Decimal;
  updatingClass: UPDATING_CLASS;
  min: Decimal;
  max: Decimal;
  step: Decimal;
};

type Action =
  | {
      type: 'valor-posterior';
      payload: {
        onChange?: (value: number) => void;
      };
    }
  | {
      type: 'valor-anterior';
      payload: {
        onChange?: (value: number) => void;
      };
    }
  | {
      type: 'alinhar-valores';
    };

function arredondarValor({value, min, step}: State){
  return min.plus(value.minus(min).minus(value.minus(min).mod(step)));
}

function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'valor-anterior': {
      const newValue = arredondarValor(state).minus(state.step || 1);
      if(newValue.lessThan(state.min)) return state;
      action.payload.onChange && action.payload.onChange(Number(newValue));
      return {
        ...state,
        value: newValue,
        updatingClass: UPDATING_CLASS.subtracting,
      };
    }

    case 'valor-posterior': {
      const newValue = arredondarValor(state).plus(state.step || 1);
      if(newValue.greaterThan(state.max)) return state;
      action.payload.onChange && action.payload.onChange(Number(newValue));
      return {
        ...state,
        value: newValue,
        updatingClass: UPDATING_CLASS.adding,
      };
    }

    case 'alinhar-valores': {
      return {
        ...state,
        prevValue: state.value,
        updatingClass: 
          state.value.greaterThan(state.prevValue) 
          ? UPDATING_CLASS.added 
          : UPDATING_CLASS.subtracted
      };
    }

    default:
      return state;
  }
}

export default function InputSeletor(props: InputSeletorProps) {
  const [state, dispatch] = useReducer(reducer, null, () => {
    return {
      value: new Decimal(props.value),
      prevValue: new Decimal(props.value),
      min: new Decimal(props.min),
      max: new Decimal(props.max),
      step: new Decimal(props.step || 1),
    } as State;
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch({ type: 'alinhar-valores' });
    }, 100);

    return () => {
      clearTimeout(timeout);
    };
  }, [state.value]);

  const formatter = (val: Decimal) => {
    return props.formatter ? props.formatter(Number(val)) : val.toString();
  };

  return (
    <div className={`flex flex-col items-center justify-center ${props.className ?? ''}`}>
      {props.labelUp && <span className='text-lg'>{props.labelUp}</span>}
      <button
        className="flex items-center justify-center w-full h-6 after:absolute after:w-2 after:h-2 after:border-gray-900 after:border-t-2 after:border-l-2 after:rotate-45 after:translate-y-1"
        onClick={() =>
          dispatch({ type: 'valor-posterior', payload: { onChange: props.onChange } })
        }
      />
      <div className="relative w-32 h-10 overflow-hidden text-2xl">
        <div className={`absolute w-full h-10 flex ${state.updatingClass}`}>
          <div className="flex items-center justify-center w-full min-h-[2.5rem]">
            {formatter(state.prevValue)}
          </div>
          <div className="flex items-center justify-center w-full min-h-[2.5rem]">
            {formatter(state.value)}
          </div>
        </div>
      </div>
      <button
        className="flex items-center justify-center w-full h-6 after:absolute after:w-2 after:h-2 after:border-gray-900 after:border-b-2 after:border-r-2 after:rotate-45 after:-translate-y-1"
        onClick={() =>
          dispatch({ type: 'valor-anterior', payload: { onChange: props.onChange } })
        }
      />
      {props.labelDown && <span className='text-lg'>{props.labelDown}</span>}
    </div>
  );
}
