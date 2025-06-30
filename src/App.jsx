import AddProduct from "./components/AddProduct";
import ProductDetails from "./components/ProductDetails";
import ProductList from "./components/ProductList";

export default function App() {
  return (
    <div className="flex m-2">
      <AddProduct />
      <ProductList />
      <ProductDetails id={5} />
    </div>
  );
}
