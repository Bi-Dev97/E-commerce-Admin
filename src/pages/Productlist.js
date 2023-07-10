/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
//import { BiEdit } from "react-icons/bi";
import { AiFillDelete, AiOutlineEye } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteAProduct, getProducts } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import { resetState } from "../features/blogs/blogSlice";
import CustomModal from "../components/CustomModal";

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [prodId, setProdId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setProdId(e);
  };
  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getProducts());
  }, []);
  const productState = useSelector((state) => state?.product?.products);
  console.log(productState);
  // Filter States
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [titles, setTitles] = useState([]);

  useEffect(() => {
    let newTitles = [];
    let newCategories = [];
    let newBrands = [];
    for (let index = 0; index < productState?.length; index++) {
      const element = productState[index];
      newBrands.push(element?.brand);
      newCategories.push(element?.category);
      newTitles.push(element?.title);
    }
    setBrands(newBrands);
    setCategories(newCategories);
    setTitles(newTitles);
  }, [productState]);

  const columns = [
    {
      title: "No.",
      dataIndex: "key",
    },
    {
      title: "Title",
      dataIndex: "title",
      filters: titles
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .map((item) => {
          return { text: item, value: item };
        }),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.title.startsWith(value),
      width: "15%",
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      filters: brands
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .map((item) => {
          return { text: item, value: item };
        }),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.brand.startsWith(value),
      width: "15%",
      sorter: (a, b) => a.brand.length - b.brand.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      filters: categories
        .filter((item, i, ar) => ar.indexOf(item) === i)
        .map((item) => {
          return { text: item, value: item };
        }),
      filterMode: "tree",
      filterSearch: true,
      onFilter: (value, record) => record.category.startsWith(value),
      width: "15%",
      sorter: (a, b) => a.category.length - b.category.length,
    },
    {
      title: "Color",
      dataIndex: "color",
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price.split(" ")[0] - b.price.split(" ")[0],
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  const data1 = [];
  for (let i = 0; i < productState.length; i++) {
    data1.push({
      key: i + 1,
      title: productState[i]?.title,
      brand: productState[i]?.brand,
      category: productState[i]?.category,
      color: (
        <>
          <ul className="colors ps-0">
            {productState[i]?.color?.map((item, index) => {
              return (
                <li style={{ backgroundColor: item?.title }} key={index}></li>
              );
            })}
          </ul>
        </>
      ),
      price: `${productState[i]?.price} $`,
      quantity: productState[i].quantity,
      action: (
        <>
          {/**<Link
            to={`/admin/product/${productState[i]._id}`}
            className="fs-5 text-danger"
          >
            <BiEdit />
      </Link>*/}
          <Link
            className="ms-3 fs-3 text-danger"
            to={`/admin/product/view/${productState[i]?._id}`}
          >
            <AiOutlineEye />
          </Link>
          <button
            className="ms-3 fs-3 text-danger bg-transparent border-0"
            onClick={() => {
              showModal(productState[i]?._id);
            }}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  console.log(data1);
  const deleteProduct = (e) => {
    dispatch(deleteAProduct(e));
    setTimeout(() => {
      dispatch(getProducts());
    }, 100);
    setOpen(false);
  };
  return (
    <div>
      <h3 className="mb-4 title">Products</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProduct(prodId);
        }}
        title="Are you sure you want to delete this product?"
      />
    </div>
  );
};

export default Productlist;
