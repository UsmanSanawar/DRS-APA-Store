// react
import React, { Component } from "react";
// third-party
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
// data stubs
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";
// application
import Pagination from "../shared/Pagination";
import "./orders.css";
import BlogForm from "./AccountBlogForm";
import { toast } from "react-toastify";
import Parser from "html-react-parser";

class AccountPageBlogs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      blogs: [],
      selected: "order",
      headers: {},
      page: 1,
      open: false,
      showForm: false,
      blogId: null,
    };
  }

  componentDidMount() {
    this.handleGetBlogsByCustomerId(1, 15, this.props.customer.customerId);
  }

  handleEvent = (id, evt) => {
    if (evt === "edit") {
      this.setState({
        blogId: id,
      });
      this.handleForm(true);
    }

    if (evt === "delete") {
      RestService.deleteBlogPost(id).then((res) => {
        toast[res.data.status](res.data.message);
      });
    }
  };

  handleGetBlogsByCustomerId = (page, pageSize = 15) => {
    RestService.getBlogPostsByCustomerId(
      page,
      pageSize,
      this.props.customer.customerId
    ).then((r) => {
      if (r.data.status === "success") {
        let data = [];
        let response = r.data.data;

        this.setState({ headers: JSON.parse(r.headers["x-pagination"]) });
        response.sort(function (a, b) {
          return new Date(b.createdOn) - new Date(a.createdOn);
        });

        response.length > 0 &&
          response.map((item) => {
            data.push({
              blogId: item.blogId,
              title: item.blogTitle,
              blog: item.content.slice(0, 30) + "...",
              date: item.createdOn
                ? new Date(item.createdOn).toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "Invalid date",
              status: item.isApproved ? (
                <i className="fa fa-check text-center text-success" />
              ) : (
                <i className="fa fa-times text-center text-danger" />
              ),

              total: (
                <div>
                  <span
                    onClick={() => {
                      this.handleEvent(item.blogId, "edit");
                    }}
                    className="mx-2"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-pencil-alt text-info" />
                  </span>

                  <span
                    onClick={() => this.handleEvent(item.blogId, "delete")}
                    className="mx-2"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="fa fa-trash text-danger" />
                  </span>
                </div>
              ),
            });
          });
        this.setState({
          blogs: data,
        });
      }
    });
  };

  handlePageChange = (page) => {
    this.setState(() => ({ page }));

    this.handleGetBlogsByCustomerId(page, 15, this.props.customer.customerId);
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleForm = (evt) => {
    this.setState({
      showForm: evt,
    });
  };

  render() {
    const { page, blogs, showForm, blogId } = this.state;

    const blogsList = blogs.map((blog) => (
      <tr key={blog.id}>
        <td>{`#${blog.blogId}`}</td>
        <td>{blog.title}</td>
        <td>{Parser(blog.blog)}</td>
        <td>{blog.status}</td>
        <td>{blog.total}</td>
      </tr>
    ));

    return (
      <div className="card">
        <Helmet>
          <title>{`My Blogs — ${theme.name}`}</title>
        </Helmet>

        {!showForm ? (
          <div>
            <div className="card-header">
              <div className="row col-md-12">
                <div className="mr-auto">
                  <h5 className="mt-2">My Blogs</h5>
                </div>

                <div className="ml-auto">
                  <button
                    onClick={() => {
                      this.handleForm(true);
                      this.setState({ blogId: null });
                    }}
                    className="btn btn-success"
                  >
                    Create Blog
                  </button>
                </div>
              </div>
            </div>
            <div className="card-divider" />
            <div className="card-table">
              <div className="table-responsive-sm">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Blog Title</th>
                      <th>Blog</th>
                      <th>Approved</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>{blogsList}</tbody>
                </table>
              </div>
            </div>
            <div className="card-divider" />
            <div className="card-footer">
              <Pagination
                current={page}
                total={this.state.headers.totalPages}
                onPageChange={this.handlePageChange}
              />
            </div>
          </div>
        ) : (
          <div>
            <BlogForm blogId={blogId} handleForm={this.handleForm} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  customer: auth.profile,
});

export default connect(mapStateToProps)(AccountPageBlogs);
