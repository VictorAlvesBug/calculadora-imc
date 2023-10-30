import InputSeletor from "./InputSeletor";
import { useState } from 'react';
import Odometro, { TipoLegenda, Colors } from "./Odometro";
import tailwindColors from 'tailwindcss/colors';

export default function CalculadoraImc(){
  const [altura, setAltura] = useState(1.73);
  const [peso, setPeso] = useState(70);

  const imc = peso / (altura*altura);

    return (
      <div className="flex flex-col items-center justify-start w-full h-screen gap-2 pt-16 bg-gray-200">
        <div className="flex flex-row items-center justify-center gap-4">
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
          valor={imc}
          min={10}
          max={45}
          labels={[
            {min: 10, max: 18.5, descricao: 'Abaixo do Peso', color: Colors.violet},
            {min: 18.5, max: 25, descricao: 'Normal', color: Colors.blue},
            {min: 25, max: 30, descricao: 'Sobrepeso', color: Colors.green},
            {min: 30, max: 35, descricao: 'Obesidade Grau I', color: Colors.yellow},
            {min: 35, max: 40, descricao: 'Obesidade Grau II', color: Colors.orange},
            {min: 40, max: 45, descricao: 'Obesidade Grau III', color: Colors.red},
          ]}
          tipoLegenda={TipoLegenda.DIREITA}/>
        <div>Seu IMC é {imc.toFixed(2)}</div>
      </div>
    );
}