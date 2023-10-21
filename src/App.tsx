import React, { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { FORM_STATUS } from './hooks/formStatus';
import CalculadoraImc from './components/CalculadoraImc';

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
    <CalculadoraImc />
  );
}

export default App;
