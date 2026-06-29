import { useState } from "react";
import { Wallet, IndianRupee } from "lucide-react";
import HeaderBtn from "../components/Buttons/HeaderBtn";
import { currencyResolver, type CurrencyFormData } from "../Schema";
import { useForm } from "react-hook-form";
import CommonModal from "../components/Model";
import { useAddCurrency } from "../hooks/customMutation";
import { userGetCurrency } from "../hooks/customQuery";

const notes = [2000, 500, 200, 100, 50, 20, 10, 5, 2, 1] as const;

const CashDrawer = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CurrencyFormData>({
    resolver: currencyResolver,

    defaultValues: {
      "500": 0,
      "200": 0,
      "100": 0,
      "50": 0,
      "20": 0,
      "10": 0,
      "5": 0,
      "2": 0,
      "1": 0,
    },
  });

  const { mutate: addCurrency } = useAddCurrency({
    setIsModalOpen,
    reset,
  });

  const { data: currencyData } = userGetCurrency({
    page: 1,
    limit: 10,
  });

  const parsedCurrency = currencyData?.data?.currency
    ? JSON.parse(currencyData.data.currency)
    : {};

  const totalBalance = currencyData?.data?.amount || 0;

  const onSubmitCurrency = (data: CurrencyFormData) => {
    addCurrency(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cash Drawer</h1>

          <p className="text-gray-500 mt-1">
            Manage physical cash and office transactions
          </p>
        </div>

        <HeaderBtn btnName="+ Add Cash" onClick={() => setIsModalOpen(true)} />
      </div>

      {/* TOP SECTION */}
      <div className="mt-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 font-medium text-sm">Total Balance</p>

              <h2 className="text-3xl font-bold text-gray-900 mt-3">
                ₹{totalBalance.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="bg-blue-100 p-3 rounded-xl">
              <Wallet className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* BREAKDOWN */}
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="text-blue-600" size={18} />

          <h2 className="text-xl font-semibold text-gray-900">
            Currency Breakdown
          </h2>
        </div>

        <div className="flex flex-wrap gap-4">
          {notes.map((note) => {
            const count = parsedCurrency[note] || 0;

            if (count <= 0) return null;

            const total = note * count;

            return (
              <div
                key={note}
                className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            w-[140px]
            p-4
            shadow-sm
            hover:shadow-md
            transition-all
          "
              >
                <div className="flex flex-col items-center text-center">
                  {/* NOTE */}
                  <h3 className="text-2xl font-bold text-gray-900">₹{note}</h3>

                  {/* COUNT */}
                  <p className="text-gray-500 text-sm mt-1">× {count}</p>

                  {/* TOTAL */}
                  <p className="text-blue-600 font-semibold text-2xl mt-3">
                    ₹{total.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      <CommonModal
        isOpen={isModalOpen}
        title={"Add Cash"}
        onSave={handleSubmit(onSubmitCurrency)}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {notes
              .filter((note) => note !== 2000)
              .map((note) => (
                <div key={note} className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    ₹{note} Note Count
                  </label>

                  <input
                    type="number"
                    min={0}
                    placeholder={`Enter ₹${note} count`}
                    {...register(`${note}`, {
                      valueAsNumber: true,
                    })}
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      focus:ring-2
                      focus:ring-blue-500
                      focus:border-blue-500
                      transition-all
                    "
                  />

                  {errors[note] && (
                    <p className="text-red-500 text-sm">
                      {errors[note]?.message}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </form>
      </CommonModal>
    </div>
  );
};

export default CashDrawer;
