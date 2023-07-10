/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteAProductCategory,
  getCategories,
  resetState,
} from "../features/pcategory/pcategorySlice";
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

const Categorylist = () => {
  const [open, setOpen] = useState(false);
  const [pCatId, setpCatId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setpCatId(e);
  };
  const hideModal = () => {
    setOpen(false);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState()); // Here we must reset the form's field 
    //to the initial value otherwise the edit will not work for others items 
    dispatch(getCategories());  
  }, []);
  const pCatState = useSelector((state) => state?.pCategory?.pCategories);
  const data1 = [];
  for (let i = 0; i < pCatState?.length; i++) {
    data1.push({
      key: i + 1,
      name: pCatState[i]?.title,
      action: (
        <>
          <Link
            to={`/admin/category/${pCatState[i]?._id}`}
            className="fs-4 text-danger"
          >
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-4 text-danger bg-transparent border-0"
            onClick={() => {
              showModal(pCatState[i]?._id);
            }}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  const deleteProductCategory = (e) => {
    dispatch(deleteAProductCategory(e));
    setTimeout(() => {
      dispatch(getCategories());
    }, 100);
    setOpen(false);
  };
  return (
    <div>
      <h3 className="mb-4 title">Product Categories</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteProductCategory(pCatId);
        }}
        title="Are you sure you want to delete this Product Category?"
      />
    </div>
  );
};

export default Categorylist;
