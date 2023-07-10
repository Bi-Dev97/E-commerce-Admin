/* eslint-disable react-hooks/exhaustive-deps */
import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill"; /**React-Quill is a react component that wraps Quill.js 
which is a free and open-source WYSIWYG text editor. */
import "react-quill/dist/quill.snow.css";
/**import { Stepper } from "react-form-stepper"; /**It provides a wizard-like workflow. Steppers display 
progress through a sequence of logical and numbered steps.
 They may also be used for navigation. Steppers may display a transient feedback message after a  */
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { useFormik } from "formik";
import { object, string } from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getCategories,
  resetState,
} from "../features/bcategory/bcategorySlice";
import {
  createBlogs,
  getABlog,
  updateABlog,
} from "../features/blogs/blogSlice";

let schema = object({
  title: string().required("Title is Required"),
  description: string().required("Description is Required"),
  category: string().required("Category is Required"),
});
const Addblog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3];
  const imgState = useSelector((state) => state?.upload?.images);
  const bCatState = useSelector((state) => state?.bCategory?.bCategories);
  const newBlogState = useSelector((state) => state?.blogs);
  const {
    isSuccess,
    isError,
    isLoading,
    createdBlog,
    blogName,
    blogDesc,
    blogCategory,
    blogImages,
    updatedBlog,
  } = newBlogState;
  useEffect(() => {
    if (getBlogId !== undefined) {
      dispatch(getABlog(getBlogId));
      img.push(blogImages);
    } else {
      dispatch(resetState());
    }
  }, [getBlogId]);

  useEffect(() => {
    dispatch(resetState());
    dispatch(getCategories());
  }, []);

  useEffect(() => {
    if (isSuccess && createdBlog) {
      toast.success("Blog Added Successfully!");
    }
    if (isSuccess && updatedBlog) {
      toast.success("Blog Updated Successfully!");
      navigate("/admin/blog-list");
    }
    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);

  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i?.public_id,
      url: i?.url,
    });
  });
  console.log(img);

  useEffect(() => {
    formik.values.images = img;
  }, [blogImages]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blogName || "",
      description: blogDesc || "",
      category: blogCategory || "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getBlogId !== undefined) {
        const data = { id: getBlogId, blogData: values };
        dispatch(updateABlog(data));
        dispatch(resetState());
      } else {
        dispatch(createBlogs(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          // navigate("/admin/blog-list");
        }, 300);
      }
    },
  });
  return (
    <div>
      <h3 className="mb-4 title">
        {getBlogId !== undefined ? "Edit" : "Add"} Blog
      </h3>

      <div className="">
        <form action="" onSubmit={formik.handleSubmit}>
          <div className="mt-4">
            <CustomInput
              type="text"
              label="Enter Blog Title"
              name="title"
              onCh={formik.handleChange("title")}
              onBl={formik.handleBlur("title")}
              val={formik.values.title}
            />
          </div>
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          <select
            name="category"
            onChange={formik.handleChange("category")}
            onBlur={formik.handleBlur("category")}
            value={formik.values.category}
            className="form-control py-3  mt-3"
            id=""
          >
            <option value="" disabled>
              Select Blog Category
            </option>
            {bCatState?.map((i, j) => {
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
          <ReactQuill
            theme="snow"
            className="mt-3"
            name="description"
            onChange={formik.handleChange("description")}
            value={formik.values.description}
          />
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          <div className="bg-white border-1 p-5 text-center mt-3">
            <Dropzone
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
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
          <div className="showimages d-flex flex-wrap gap-3 mt-3">
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
            {getBlogId !== undefined ? "Edit" : "Add"} Blog
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addblog;
