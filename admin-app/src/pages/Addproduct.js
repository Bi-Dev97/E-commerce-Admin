/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill"; /**React-Quill is a react component that wraps Quill.js 
which is a free and open-source WYSIWYG text editor. */
import "react-quill/dist/quill.snow.css";
import { useFormik } from "formik";
import { object, string, number, array } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "./../features/brand/brandSlice";
import { getCategories } from "./../features/pcategory/pcategorySlice";
import { getColors } from "./../features/color/colorSlice";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, resetState } from "../features/product/productSlice";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

let schema = object({
  title: string().required("Title is Required"),
  description: string().required("Description is Required"),
  price: number().required("Price is required"),
  brand: string().required("Brand is Required"),
  category: string().required("Category is Required"),
  tags: string().required("Tag is Required"),
  color: array()
    .min(1, "Pick at least one color")
    .required("Colors are Required"),
  quantity: number().required("Quantity is required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [color, setColor] = useState([]);

  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
  }, []);

  const brandState = useSelector((state) => state?.brand?.brands);
  const catState = useSelector((state) => state?.pCategory?.pCategories);
  const colorState = useSelector((state) => state?.color?.colors);
  const imgState = useSelector((state) => state?.upload?.images);
  const newProduct = useSelector((state) => state?.product);
  const { isSuccess, isError, isLoading, createdProduct } = newProduct;
  useEffect(() => {
    if (isSuccess && createdProduct) {
      toast.success("Product Added Successfully!");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const coloropt = [];
  colorState.forEach((i) => {
    coloropt.push({
      label: i?.title,
      value: i?._id,
    });
  });

  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i?.public_id,
      url: i?.url,
    });
  });

  useEffect(() => {
    formik.values.color = color ? color : "";
    formik.values.images = img;
  }, [color, img]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      price: "",
      brand: "",
      category: "",
      tags: "",
      color: "",
      quantity: "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(createProducts(values));
      formik.resetForm();
      setColor(null);
      setTimeout(() => {
        dispatch(resetState());
        dispatch(getBrands());
        dispatch(getCategories());
        dispatch(getColors());
        //navigate("/admin/list-product");
      }, 300);
    },
  });
  const handleColors = (e) => {
    setColor(e);
    console.log(e);
  };
  return (
    <div>
      <h3 className="mb-4 title">Add Product</h3>
      <div>
        <form
          action=""
          onSubmit={formik.handleSubmit}
          className="d-flex gap-3 flex-column"
        >
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onCh={formik.handleChange("title")}
            onBl={formik.handleBlur("title")}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <div className="mb-3">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={formik.handleChange("description")}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onCh={formik.handleChange("price")}
            onBl={formik.handleBlur("price")}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          <select
            name="brand"
            onChange={formik.handleChange("brand")}
            onBlur={formik.handleBlur("brand")}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Brand
            </option>
            {brandState?.map((i, j) => {
              return (
                <option key={j} value={i?.title}>
                  {i?.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Category
            </option>
            {catState?.map((i, j) => {
              return (
                <option key={j} value={i?.title}>
                  {i?.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          <select
            name="tags"
            onChange={formik.handleChange("tags")}
            onBlur={formik.handleBlur("tags")}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Tag
            </option>
            <option value="featured">Featured</option>
            <option value="popular">Popular</option>
            <option value="special">Special</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>
          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            defaultValue={color}
            onChange={(i) => handleColors(i)}
            options={coloropt}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onCh={formik.handleChange("quantity")}
            onBl={formik.handleBlur("quantity")}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          <div className="bg-white border-1 p-5 text-center">
            <Dropzone
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
              multiple
              maxFiles={2}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />
                    <p>
                      Drag 'n' drop some files here, or click to select files
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
          <div className="showimages d-flex flex-wrap gap-3">
            {imgState?.map((i, j) => {
              return (
                <div className="position-relative" key={j}>
                  <button
                    type="button"
                    onClick={() => dispatch(delImg(i?.public_id))}
                    className="btn-close position-absolute"
                    style={{ top: "10px", right: "10px" }}
                  ></button>
                  <img src={i?.url} alt="" width={200} height={200} />
                </div>
              );
            })}
          </div>
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;
