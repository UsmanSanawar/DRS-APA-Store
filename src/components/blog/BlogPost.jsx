// react
import React, { useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// application
import BlogCommentsList from "./BlogCommentsList";

// data stubs
// import comments from '../../data/blogPostComments';
import posts from "../../data/blogPosts";
import RestService from "../../store/restService/restService";
import { toast } from "react-toastify";
import { IMAGE_URL } from "../../constant/constants";

export default function BlogPost(props) {
  const { layout, blogPost, blogPostComments } = props;
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    blogId: props.blogId,
    comment: "",
  });
  const postClasses = classNames("post__content typography", {
    "typography--expanded": layout === "full",
  });

  const relatedPostsList = posts.slice(0, 2).map((relatedPost) => (
    <div
      key={relatedPost.id}
      className="related-posts__item post-card post-card--layout--related"
    >
      <div className="post-card__image">
        <img src={relatedPost.image} alt="" />
      </div>
      <div className="post-card__info">
        <div className="post-card__name">{relatedPost.title}</div>
        <div className="post-card__date">{relatedPost.date}</div>
      </div>
    </div>
  ));

  const submitComment = () => {
    formData.customerId = parseInt(
      JSON.parse(localStorage.getItem("identity"))
    );
    RestService.postBlogComment(formData).then((r) => {
      toast[r.data.status](r.data.message);
      if (r.data.status === "success") {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          blogId: props.blogId,
          comment: "",
        });
      }
    });
  };

  return (
    <div className={`block post post--layout--${layout}`}>
      <div
        className={`post__header post-header post-header--layout--${layout}`}
      >
        <div className="post-header__categories">
          {blogPost.blogCategoryName}
        </div>
        <h1 className="post-header__title">{blogPost.blogTitle}</h1>
        <div className="post-header__meta">
          <div className="post-header__meta-item">
            By
            {blogPost.metaTagTitle}
          </div>
          <div className="post-header__meta-item">
            {new Date(blogPost.approvedDate).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
          <div className="post-header__meta-item">
            ({(blogPostComments && blogPostComments.length) || 0}) Comments
          </div>
        </div>
      </div>

      <div className="post__featured">
        <img src={`${IMAGE_URL}/blogs/${blogPost.image}`} alt="" />
      </div>

      <div
        className={postClasses}
        dangerouslySetInnerHTML={{
          __html: (blogPost.content && blogPost.content) || "",
        }}
      />

      <div className="post__footer">
     
        <div className="post-author">
          <div className="post-author__avatar">
            <Link to="/">
              <img src="images/avatars/avatar-1.jpg" alt="" />
            </Link>
          </div>
          <div className="post-author__info">
            <div className="post-author__name">
              <Link to="/">Jessica Moore</Link>
            </div>
            <div className="post-author__about">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
              suscipit suscipit mi, non tempor nulla finibus eget. Lorem ipsum
              dolor sit amet, consectetur adipiscing elit.
            </div>
          </div>
        </div>
      </div>
      <section className="post__section">
        <h4 className="post__section-title">Related Posts</h4>
        <div className="related-posts">
          <div className="related-posts__list">{relatedPostsList}</div>
        </div>
      </section>

      <section className="post__section">
        <h4 className="post__section-title">{`Comments (${blogPostComments.length})`}</h4>

        <BlogCommentsList comments={blogPostComments} />
      </section>

      <section className="post__section">
        <h4 className="post__section-title">
          {localStorage.getItem("token")
            ? "Write a comment"
            : "Login to write a Comment"}
        </h4>
        {localStorage.getItem("token") !== null && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitComment();
            }}
          >
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="comment-first-name">First Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="comment-first-name"
                  value={formData.firstName}
                  placeholder="First Name"
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="comment-last-name">Last Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  id="comment-last-name"
                  value={formData.lastName}
                  placeholder="Last Name"
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                />
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="comment-email">Email Address</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  id="comment-email"
                  value={formData.email}
                  placeholder="Email Address"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="comment-content">Comment</label>
              <textarea
                required
                className="form-control"
                value={formData.comment}
                onChange={(e) =>
                  setFormData({ ...formData, comment: e.target.value })
                }
                id="comment-content"
                rows="6"
              />
            </div>
            <div className="form-group mt-4">
              <button type="submit" className="btn btn-primary btn-lg">
                Post Comment
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
}

BlogPost.propTypes = {
  /**
   * post layout
   * one of ['classic', 'full'] (default: 'classic')
   */
  layout: PropTypes.oneOf(["classic", "full"]),
};

BlogPost.defaultProps = {
  layout: "classic",
};
