import { useState } from 'react';
import { Button } from 'primereact/Button';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; //theme
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icons

import './App.scss';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Button label="test" />
    </div>
  );
}

export default App;
