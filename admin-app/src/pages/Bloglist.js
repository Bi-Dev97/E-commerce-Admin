/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteABlog, getBlogs, resetState } from "../features/blogs/blogSlice";
import CustomModal from "../components/CustomModal";

const Bloglist = () => {
  const [open, setOpen] = useState(false);
  const [blogId, setBlogId] = useState("");
  const showModal = (e) => {
    setOpen(true);
    setBlogId(e);
  };
  const hideModal = () => {
    setOpen(false);
  };
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(resetState());
    dispatch(getBlogs());
  }, []);

  const getBlogState = useSelector((state) => state?.blogs?.blogs);

  useEffect(() => {
    let newCategories = [];
    for (let index = 0; index < getBlogState?.length; index++) {
      const element = getBlogState[index];
      newCategories.push(element?.category);
    }
    setCategories(newCategories);
  }, [getBlogState]);
  const columns = [
    {
      title: "No.",
      dataIndex: "key",
    },
    {
      title: "Title",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
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
      sorter: (a, b) => a.title.length - b.category.length,
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  const data1 = [];
  for (let i = 0; i < getBlogState?.length; i++) {
    data1.push({
      key: i + 1,
      name: getBlogState[i]?.title,
      category: getBlogState[i]?.category,
      action: (
        <>
          <Link
            to={`/admin/blog/${getBlogState[i]._id}`}
            className="fs-4 text-danger"
          >
            <BiEdit />
          </Link>
          <button
            className="ms-3 fs-4 text-danger bg-transparent border-0"
            onClick={() => {
              showModal(getBlogState[i]?._id);
            }}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    });
  }
  const deleteBlog = (e) => {
    dispatch(deleteABlog(e));
    setTimeout(() => {
      dispatch(getBlogs());
    }, 100);
    setOpen(false);
  };
  return (
    <div>
      <h3 className="mb-4 title">Blogs List</h3>
      <div>
        <Table columns={columns} dataSource={data1} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          deleteBlog(blogId);
        }}
        title="Are you sure you want to delete this blog?"
      />
    </div>
  );
};

export default Bloglist;
