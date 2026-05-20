import { useState } from "react";
import HeaderBtn from "../components/Buttons/HeaderBtn";
import { productResolver, type ProductFormData } from "../Schema";
import { useForm } from "react-hook-form";
import CommonModal from "../components/Model";
import {
  useCreateProduct,
  useDeleteProduct,
  useUpdateProduct,
  // useUpdateProduct,
} from "../hooks/customMutation";
import { useGetProducts } from "../hooks/customQuery";
import ProductCard from "../components/Cards/ProductCard";
import type { Product } from "../types";

const Products = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { mutate: createProduct } = useCreateProduct({ setIsModalOpen });
  // const { mutate: updateProduct } = useUpdateProduct({ setIsModalOpen });
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: productResolver,
  });
 
  const { data: products } = useGetProducts(1, 10, "");
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: updateProduct } = useUpdateProduct({ setIsModalOpen });
  const onSubmitProduct = (data: ProductFormData) => {
    if (selectedProduct) {
      updateProduct({ ...data, id: selectedProduct.id });
    } else {
      createProduct(data, {
        onSuccess: () => {
          reset({
            name: "",
            description: "",
            price: 0,
            tax: 0,
          });

          setIsModalOpen(false);
        },
      });
    }
  };

  const handleEdit = (Product: Product) => {
    setSelectedProduct(Product);
    reset({
      name: Product.name,
      description: Product.description,
      price: Product.Price,
      tax: Product.tax,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <div className="flex flex-col items-start">
          <span className="text-2xl font-semibold text-foreground">
            Products & Services
          </span>

          <span className="text-muted-foreground">Manage your offerings</span>
        </div>

        <HeaderBtn
          btnName="+ Add Product"
          onClick={() => setIsModalOpen(true)}
        />
      </div>
      <div className="mt-6 overflow-x-auto rounded-xl h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {products?.data?.map((product: Product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.Price}
              tax={product.tax}
              description={product.description}
              onDelete={deleteProduct}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>
      <CommonModal
        title={selectedProduct ? "Edit Product" : "Add Product"}
        isOpen={isModalOpen}
        onSave={handleSubmit(onSubmitProduct)}
        onCancel={() => {
          setIsModalOpen(false);

          reset({
            name: "",
            description: "",
            price: 0,
            tax: 0,
          });
        }}
      >
        <form className="flex flex-col gap-4">
          <div>
            <input
              type="text"
              placeholder="Product Name"
              {...register("name")}
              className="border p-2 rounded-md w-full"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Product Description"
              {...register("description")}
              className="border p-2 rounded-md w-full"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Price"
              {...register("price", {
                valueAsNumber: true,
              })}
              className="border p-2 rounded-md w-full"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              placeholder="Tax"
              {...register("tax", {
                valueAsNumber: true,
              })}
              className="border p-2 rounded-md w-full"
            />
            {errors.tax && (
              <p className="text-red-500 text-sm mt-1">{errors.tax.message}</p>
            )}
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

export default Products;
