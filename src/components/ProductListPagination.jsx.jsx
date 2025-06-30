import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const retrieveProducts = async ({ queryKey }) => {
  // fetched Dummy json
  //   const response = await axios.get("https://dummyjson.com/products");
  //   return response.data.products;

  // Fetched from json server in own matchine
  // const response = await axios.get(`http://localhost:3000/${queryKey[0]}`);
  const response = await axios.get(
    `http://localhost:3000/products?_page=${queryKey[1].page}&_per_page=6`
  );
  return response.data;
};

export default function ProductList() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const {
    data: products,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["products", { page }],
    queryFn: retrieveProducts,
    // by default it's retry 3 times. using false it will not retry again for fetching
    // retry: false,
    // dtat will go to stale from fresh after 5s
    // staleTime: 5000,
    // refeatch data after 2s
    // refetchInterval: 2000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`http://localhost:3000/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]); // Refresh product list
    },
  });

  if (isLoading) return <div>Fetching products...</div>;
  if (error) return <div>An error occured {error.message}</div>;

  return (
    <>
      <div className="flex flex-col justify-center items-center w-3/5">
        <h2 className="text-3xl my-2">Product List</h2>
        <ul className="flex flex-wrap justify-center items-center">
          {products.data &&
            products.data.map((product) => (
              <li
                key={product.id}
                className="flex flex-col items-center m-2 border rounded-sm"
              >
                <img
                  className="object-cover h-64 w-96 rounded-sm"
                  src={product.thumbnail}
                  alt={product.title}
                />
                <p className="text-xl my-3">{product.title}</p>
                <button
                  onClick={() => deleteMutation.mutate(product.id)}
                  className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
                >
                  Delete
                </button>
              </li>
            ))}
        </ul>
        <div className="flex">
          {products.prev && (
            <button
              className="p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm"
              onClick={() => setPage(products.prev)}
            >
              {" "}
              Prev{" "}
            </button>
          )}
          {products.next && (
            <button
              className="p-1 mx-1 bg-gray-100 border cursor-pointer rounded-sm"
              onClick={() => setPage(products.next)}
            >
              {" "}
              Next{" "}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
