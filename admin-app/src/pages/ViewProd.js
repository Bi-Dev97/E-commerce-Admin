/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BiArrowBack } from "react-icons/bi";
import {
  getAProduct,
} from "../features/product/productSlice";

const ViewProd = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getProdId = location.pathname.split("/")[4];
  console.log(getProdId);
  const prodState = useSelector((state) => state?.product);
  const {
    prodTitle,
    prodDesc,
    prodPrice,
    prodBrand,
    prodCategory,
    prodTags,
    prodColor,
    prodQty,
    prodImgs,
  } = prodState;
  useEffect(() => {
    dispatch(getAProduct(getProdId));
  }, [getProdId]);
  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="mb-4 title">View Product</h3>
        <button
          className="bg-transparent border-0 fs-6 mb-0 d-flex align-items-center gap-1"
          onClick={goBack}
        >
          <BiArrowBack className="fs-5" /> Go Back
        </button>
      </div>
      <div className="mt-5 bg-white p-4 d-flex gap-3 flex-column rounded-3">
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Title:</h6>
          <p className="mb-0">{prodTitle}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Description:</h6>
          <p className="mb-0">{prodDesc}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Brand:</h6>
          <p className="mb-0">{prodBrand}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Category:</h6>
          <p className="mb-0">{prodCategory}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Tags:</h6>
          <p className="mb-0">{prodTags}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Price:</h6>
          <p className="mb-0 fw-bold">{`${prodPrice} $`}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Quantity:</h6>
          <p className="mb-0 fw-bold">{prodQty}</p>
        </div>
        <div className="d-flex align-items-center gap-3">
          <h6 className="mb-0">Colors:</h6>
          <ul className="colors ps-0 mb-0">
            {prodColor?.map((item, index) => {
              return (
                <li style={{ backgroundColor: item?.title }} key={index}></li>
              );
            })}
          </ul>
        </div>
        <div>
          <h6 className="mb-3">Images:</h6>
          <div className="showimages d-flex flex-column justify-content-around flex-wrap gap-3">
            {prodImgs?.map((i, j) => {
              return (
                <div className="position-relative" key={j}>
                  <img src={i?.url} alt="" width={200} height={200} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProd;
