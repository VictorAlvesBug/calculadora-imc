import InputSeletor from "./InputSeletor";
import { useState } from 'react';
import Odometro from "./Odometro";

export default function CalculadoraImc(){
  const [altura, setAltura] = useState(1.70);
  const [peso, setPeso] = useState(70);

  const imc = peso / (altura*altura);

    return (
      <div className="flex flex-col items-center justify-start w-full h-screen gap-2 pt-16 bg-gray-200">
        <div className="flex flex-row items-center justify-center gap-2">
          <InputSeletor
            className="bg-gray-300"
            labelUp="Altura"
            labelDown="metros"
            value={altura}
            onChange={setAltura}
            min={1}
            max={2.2}
            step={0.02}
            formatter={(value: number) => value.toFixed(2)}
          />
          <InputSeletor
            className="bg-gray-300"
            labelUp="Peso"
            labelDown="kg"
            value={peso}
            onChange={setPeso}
            min={30}
            max={200}
            step={0.5}
            formatter={(value: number) => value.toFixed(1)}
          />
        </div>
        <Odometro
          value={imc}
          min={6}
          max={200}
          labels={[
            {min: 6, max: 18.5, label: 'abaixo do peso', color: 'blue'},
            {min: 18.5, max: 23, label: 'peso normal', color: 'green'},
            {min: 23, max: 25, label: 'sobrepeso', color: 'yellow'},
            /*{min: 25, max: 30, label: 'obesidade', color: 'orange'},
            {min: 30, max: 200, label: 'obedidade extrema', color: 'red'},*/
          ]}/>
        <div>Seu IMC é {imc.toFixed(2)}</div>
      </div>
    );
}