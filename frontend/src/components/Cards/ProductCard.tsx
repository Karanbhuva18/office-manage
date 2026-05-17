import { Pencil, Trash } from "lucide-react";

const ProductCard = ({
  id,
  name,
  description,
  price,
  tax,
  onDelete,
  onEdit,
}: {
  id: number;
  name: string;
  description: string;
  price: number;
  tax: number;
  onDelete?: (id: number) => void;
  onEdit?: (product: {
    id: number;
    name: string;
    Price: number;
    tax: number;
    description: string;
    dept_id: number | null;
  }) => void;
}) => {
  console.log("price", price);
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300  hover:shadow-[8px_8px_20px_rgba(0,0,0,0.15)]">
      {/* TOP GRADIENT */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r " />

      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-neutral-900 capitalize">
            {name}
          </h2>

          <p className="max-w-[250px] text-sm leading-relaxed text-neutral-500">
            {description}
          </p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-neutral-200 p-2 transition hover:bg-blue-50"
            onClick={() =>
              onEdit &&
              onEdit({
                id,
                name,
                Price: price,
                tax,
                description,
                dept_id: null,
              })
            }
          >
            <Pencil size={16} className="text-blue-500" />
          </button>

          <button
            className="rounded-full border border-neutral-200 p-2 transition hover:bg-red-50"
            onClick={() => onDelete?.(id)}
          >
            <Trash size={16} className="text-red-500" />
          </button>
        </div>
      </div>

      {/* PRICE SECTION */}
      <div className="mt-6 flex items-end justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-2">
            <span className="text-xl font-bold text-neutral-900">{price}</span>
          </div>
        </div>

        {/* TAX BADGE */}
        <div className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-600">
          Tax {tax}%
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
