import React from "react";
import CustomerReviews from "../cart/CustomerReviews";

const ReviewContainer: React.FC = () => {
  return (
    <div className="bg-[#f1f2f4] py-2 sm:py-2 px-2 sm:px-4">
    <div className="w-full">
      <CustomerReviews />
    </div>
    </div>
  );
};

export default ReviewContainer;

 