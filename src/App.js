import data from "./data";
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from "./screens/Home";
import Product from "./screens/Product";

function App() {
  return (
    <BrowserRouter>
      <div>
        <header>
          <Link to="/">book store</Link>
        </header>
        <main>
          <Routes>
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/" element={<Home />} />
          </Routes>

        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
