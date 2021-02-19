// react
import React, { Component } from "react";

// third-party
import PropTypes from "prop-types";
import { Helmet } from "react-helmet";

// application
import PageHeader from "../shared/PageHeader";
import Pagination from "../shared/Pagination";
import PostCard from "../shared/PostCard";
import BlogSidebar from "./BlogSidebar";

// data stubs
// import posts from '../../data/blogPosts';
import theme from "../../data/theme";
import RestService from "../../store/restService/restService";
import { IMAGE_URL } from "../../constant/constants";
import { debounce } from "lodash";
import CircularLoader from "../../assets/loaders";
import CreateBlogForm from "./CreateBlogForm";

export default class BlogPageCategory extends Component {
  constructor(props) {
    super(props);
    this.sendQuery = (query) => this.getBlogPosts(query);
    this.debounceQuery = debounce((q) => this.sendQuery(q), 400);
    this.state = {
      page: 1,
      posts: [],
      categoryId: "",
      headers: {},
      allCategories: [],
      allComments: [],
      selectedCat: null,
      searchString: "",
      loading: false,
      showForm: false,
    };
  }

  getBlogPosts = (string) => {
    this.getBlogsApi();
  };

  componentDidMount() {
    RestService.getBlogCategories().then((r) => {
      if (r.data.status === "success") {
        this.setState({
          allCategories: r.data.data,
        });
      }
    });

    RestService.getAllBlogPostComments().then((res) => {
      if (res.data.status === "success") {
        this.setState({
          allComments: res.data.data,
        });
      }
    });

    this.getBlogsApi(this.state.page, "");
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.selectedCat !== this.state.selectedCat) {
      return this.getBlogsApi(1, "");
    }
  }

  setSelectedCat = (e) => {
    this.setState({
      selectedCat: e,
      page: 1,
    });
  };

  setSearch = (e) => {
    this.setState({
      searchString: e,
    });

    this.debounceQuery(e);
  };

  getBlogsApi = async (pg, filter = "") => {
    this.setState({
      loading: true,
    });
    filter =
      (this.state.selectedCat && `CategoryId=${this.state.selectedCat}`) || "";

    // eslint-disable-next-line no-mixed-operators
    filter =
      (filter + this.state.searchString &&
        `&searchString=${this.state.searchString}`) ||
      "";

    console.log(filter, "filterfilter");

    await RestService.getBlogPosts(pg, filter).then((r) => {
      if (r.data.status === "success") {
        this.setState({ headers: JSON.parse(r.headers["x-pagination"]) });

        let blogPosts = r.data.data;
        let newData = [];
        blogPosts.map((post) => {

          console.log(post.customerName || post.createdBy, "ssssssssssssss")

          newData.push({
            id: post.blogId,
            title: post.blogTitle,
            image: post.image
              ? `${IMAGE_URL}/blogs/${post.image}`
              : "https://lh3.googleusercontent.com/proxy/do0aplhOwlDEoaRMHU8irunbLWOJf7oznkuB62TsFMZhzCTtEz9QEiOkVlWaoTb2v0uYeBs7W0PfJ79IpZUzfk8DWcDh2glkog_56FMID09deRuO41jPtYHQxpC6KvmN",
            categories: [`${post.blogCategoryName}`],
            author: post.customerName || post.createdBy,
            date: new Date(post.createdOn).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }),
            content: post.content,
          });
        });

        this.setState({
          posts: newData,
        });
      }
    });

    this.setState({
      loading: false,
    });
  };

  handlePageChange = (page) => {
    this.getBlogsApi(page, this.state.filter);
    this.setState(() => ({ page }));
  };

  handleForm = (e) => {
    this.setState({
      showForm: e,
    });
  };

  render() {
    const { layout, sidebarPosition } = this.props;
    const { page, posts, allComments } = this.state;

    const breadcrumb = [
      { title: "Home", url: "" },
      { title: "Blog", url: "" },
      { title: "Latest News", url: "" },
    ];

    let sidebarStart;
    let sidebarEnd;

    const sidebar = (
      <BlogSidebar
        setSelectedCat={this.setSelectedCat}
        posts={posts}
        selectedCat={this.state.selectedCat}
        categories={this.state.allCategories}
        searchString={this.state.searchString}
        setSearch={this.setSearch}
        position={sidebarPosition}
        comments={allComments}
        handleForm={this.handleForm}
      />
    );

    if (sidebarPosition === "start") {
      sidebarStart = (
        <div className="col-12 col-lg-4 order-1 order-lg-0">{sidebar}</div>
      );
    } else if (sidebarPosition === "end") {
      sidebarEnd = <div className="col-12 col-lg-4">{sidebar}</div>;
    }

    const postsList = posts.map((post) => {
      const postLayout = {
        classic: "grid-lg",
        grid: "grid-nl",
        list: "list-nl",
      }[layout];

      return (
        <div key={post.id} className="posts-list__item">
          <PostCard post={post} layout={postLayout} />
        </div>
      );
    });

    return (
      <React.Fragment>
        <Helmet>
          <title>{`Blog Category Page — ${theme.name}`}</title>
        </Helmet>

        <PageHeader header="Latest News" breadcrumb={breadcrumb} />

        <div className="container">
          <div className="row">
            {sidebarStart}
            <div className="col-12 col-lg-8">
              <div className="block">
                <div className="posts-view">
                  <h2 className="w-100 pb-3 mb-5 border-bottom">Blogs</h2>

                  <div
                    className={`posts-view__list posts-list posts-list--layout--${layout}`}
                  >
                    {this.state.showForm ? (
                      <CreateBlogForm handleForm={this.handleForm} />
                    ) : (
                      <div>
                        {this.state.loading ? (
                          <div
                            style={{
                              display: "flex",
                              height: "100vh",
                              width: "100%",
                            }}
                            className="row justify-content-center align-items-center m-auto"
                          >
                            <CircularLoader />
                          </div>
                        ) : (
                          <div className="posts-list__body">{postsList}</div>
                        )}
                      </div>
                    )}
                  </div>
                  {!this.state.showForm && (
                    <div className="posts-view__pagination">
                      {this.state.headers && (
                        <Pagination
                          current={page}
                          siblings={2}
                          total={this.state.headers.totalPages}
                          onPageChange={this.handlePageChange}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {sidebarEnd}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

BlogPageCategory.propTypes = {
  /**
   * blog layout
   * one of ['classic', 'grid', 'list'] (default: 'classic')
   */
  layout: PropTypes.oneOf(["classic", "grid", "list"]),
  /**
   * sidebar position (default: 'start')
   * one of ['start', 'end']
   * for LTR scripts "start" is "left" and "end" is "right"
   */
  sidebarPosition: PropTypes.oneOf(["start", "end"]),
};

BlogPageCategory.defaultProps = {
  layout: "classic",
  sidebarPosition: "start",
};
