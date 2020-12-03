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

export default class BlogPageCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      posts: [],
      categoryId: "",
      headers: {},
      allCategories: [],
      selectedCat: null,
    };
  }

  componentDidMount() {
    RestService.getBlogCategories().then((r) => {
      if (r.data.status === "success") {
        this.setState({
          allCategories: r.data.data,
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

  getBlogsApi = (pg, filter = "") => {
    filter =
      (this.state.selectedCat && `CategoryId=${this.state.selectedCat}`) || "";

    RestService.getBlogPosts(pg, filter).then((r) => {
      if (r.data.status === "success") {
        this.setState({ headers: JSON.parse(r.headers["x-pagination"]) });

        let blogPosts = r.data.data;
        let newData = [];
        blogPosts.map((post) => {
          newData.push({
            id: post.blogId,
            title: post.blogTitle,
            image: `${IMAGE_URL}/blogs/${post.image}`,
            categories: [`${post.blogCategoryName}`],
            date: new Date(post.approvedDate).toLocaleDateString("en-US", {
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
  };

  handlePageChange = (page) => {
    this.getBlogsApi(page, this.state.filter);
    this.setState(() => ({ page }));
  };

  render() {
    console.log(this.props, "sdasdsadaaaa");

    const { layout, sidebarPosition } = this.props;
    const { page, posts } = this.state;

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
        selectedCat={this.state.selectedCat}
        categories={this.state.allCategories}
        position={sidebarPosition}
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
                  <div
                    className={`posts-view__list posts-list posts-list--layout--${layout}`}
                  >
                    <div className="posts-list__body">{postsList}</div>
                  </div>
                  <div className="posts-view__pagination">
                    <Pagination
                      current={page}
                      siblings={2}
                      total={this.state.headers.totalPages}
                      onPageChange={this.handlePageChange}
                    />
                  </div>
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
