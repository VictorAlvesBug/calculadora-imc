import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { FORM_STATUS } from './hooks/formStatus';

function App() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    getValues,
  } = useForm();

  const [imc, setImc] = useState(0);

  async function onSubmit(campos: FieldValues) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setImc(campos.peso / Math.pow(campos.altura, 2));
  }

  let status = FORM_STATUS.IDLE;

  if(isSubmitting){
    status = FORM_STATUS.LOADING;
  }
  else {
    status = Object.keys(errors).length > 0 ? FORM_STATUS.ERROR : FORM_STATUS.SUCCESS;
  }

  return (
    <div className="flex flex-col w-full h-screen justify-start pt-16 items-center bg-black">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="border border-gray-100 px-8 py-6 flex flex-col items-center gap-3"
      >
        <div className="flex flex-col gap-2 justify-center items-start py-3">
          <label className="text-gray-100">Altura (m)</label>
          <input
            {...register('altura', {
              required: 'Informe sua altura em metros',
              validate: (valor: string) => {
                const altura = Number(valor);
                if (isNaN(altura)) {
                  return 'A altura deve ser um número';
                }

                return (altura >= 0.5 && altura <= 2.5) || "A altura deve estar entre 0.5 e 2.5 metros";
              },
            })}
            className="w-80 px-3 py-1 outline-none rounded"
          />
          {errors.altura && (
            <p className="text-red-500">
              {errors.altura?.message?.toString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 justify-center items-start py-3">
          <label className="text-gray-100">Peso (kg)</label>
          <input
            {...register('peso', {
              required: 'Informe seu peso em kg',
              validate: (valor: string) => {
                const peso = Number(valor);
                if (isNaN(peso)) {
                  return 'O peso deve ser um número';
                }

                return (peso > 10 && peso < 200) || "O peso deve estar entre 10 e 200 kg";
              },
            })}
            className="w-80 px-3 py-1 outline-none rounded"
          />
          {errors.peso && (
            <p className="text-red-500">Informe um peso em kg válido</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="border-gray-500 border-2 px-4 py-2 text-gray-100 w-full hover:opacity-80"
        >
          Calcular
        </button>
      </form>
      <p className="text-white">
        {status === FORM_STATUS.LOADING && errors && 'Carregando...'}
        {status === FORM_STATUS.SUCCESS && `Seu IMC é ${imc.toFixed(2)}`}
        {status === FORM_STATUS.ERROR && `Ops, ocorreu um erro`}
      </p>
    </div>
  );
}

export default App;
