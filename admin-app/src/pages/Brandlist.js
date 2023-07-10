/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteABrand,
  getBrands,
  resetState,
} from "../features/brand/brandSlice";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModal";

const columns = [
  {
    title: "No.",
    dataIndex: "key",
  },
  {
    title: "Name",
    dataIndex: "name",
    sorter: (a, b) => a.name.length - b.name.length,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Brandlist = () => {
  const [open, setOpen] = useState(false);
  const [brandId, setBrandId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setBrandId(e);
  };
  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState()); // Here we must reset the form's field 
    //to the initial value otherwise the edit will not work for others items 
    dispatch(getBrands());
  }, []);
  const brandState = useSelector((state) => state?.brand?.brands);
  const data1 = [];
  for (let i = 0; i < brandState?.length; i++) {
    data1.push({
      key: i + 1,
      name: brandState[i]?.title,
      action: (
        <>
          <Link
            to={`/admin/brand/${brandState[i]?._id}`}
            className="fs-4 text-danger"
          >
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-4 text-danger bg-transparent border-0"
            onClick={() => {
              showModal(brandState[i]?._id);
            }}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  const deleteBrand = (e) => {
    dispatch(deleteABrand(e));
    setTimeout(() => {
      dispatch(getBrands());
    }, 100);
    setOpen(false);
  };
  return (
    <div>
      <h3 className="mb-4 title">Brands</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteBrand(brandId);
        }}
        title="Are you sure you want to delete this brand?"
      />
    </div>
  );
};

export default Brandlist;
