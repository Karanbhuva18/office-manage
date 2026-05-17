import React from "react";

const HeaderBtn = ({
  btnName,
  onClick,
}: {
  btnName: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="text-primary-foreground cursor-pointer hover:text-foreground transition-colors duration-200 font-medium bg-blue-500 px-2 rounded py-2 "
    >
      {btnName}
    </div>
  );
};

export default HeaderBtn;
