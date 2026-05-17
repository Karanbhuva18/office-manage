import type { ReactNode } from "react";

type CommonModalProps = {
  isOpen: boolean;
  title: string;
  children: ReactNode;
  onSave: () => void;
  onCancel: () => void;
  saveText?: string;
  cancelText?: string;
};

const CommonModal = ({
  isOpen,
  title,
  children,
  onSave,
  onCancel,
  saveText = "Save",
  cancelText = "Cancel",
}: CommonModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b pb-3">
          <h2 className="text-xl font-semibold">{title}</h2>

          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-black text-xl cursor-pointer"
          >
            ×
          </button>
        </div>

        {/* BODY */}
        <div className="py-4">{children}</div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
          >
            {cancelText}
          </button>

          <button
            onClick={onSave}
            className="px-4 py-2 rounded-md bg-black text-white hover:bg-black/80"
          >
            {saveText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
