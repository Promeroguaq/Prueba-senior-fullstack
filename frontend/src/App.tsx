import Header from "./components/Header";
import Catalog from "./components/Catalog";
import Cart from "./components/Cart";

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Catalog />
        <Cart />
      </main>
    </div>
  );
}
