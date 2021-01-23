// react
import React, { useState, useEffect } from "react";
import StarRatingInput from "react-star-ratings";

// application
import Pagination from "../shared/Pagination";
import Rating from "../shared/Rating";

// data stubs
// import reviews from '../../data/shopProductReviews';
import RestService from "../../store/restService/restService";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import { Spinner } from "reactstrap";

function ProductTabReviews(props) {
  let initReview = { rating: 5, text: "", productId: null };
  const [loading, setloading] = useState(true);
  const [formData, setformData] = useState(initReview);
  const [reviews, setreviews] = useState([]);
  const [reviewPagination, setreviewPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalCount: 10,
    totalPages: 2,
  });

  useEffect(() => {
    if (props.productId) {
      getReviews();
    }
  }, [props.productId]);

  function getReviews(currentPage) {
    setloading(true);
    try {
      RestService.getReviews(props.productId, currentPage).then((res) => {
        if (res.data.status === "success") {
          setreviews(res.data.data);
          setreviewPagination(JSON.parse(res.headers["x-pagination"]));
        }
        setloading(false);
      });
    } catch (err) {
      toast.error("Internal Server Error");
      setloading(false);
    }
  }

  function handlePageClick(e) {
    getReviews(e.selected + 1);
  }

  const reviewsList = reviews.map((review, index) => {
    return (
      <li key={index} className="reviews-list__item">
        <div className="review">
          <div className="review__avatar">
            <img src={"images/avatars/avatar-1.jpg"} alt="" />
          </div>
          <div className=" review__content">
            <div className=" review__author">{review.customerName}</div>
            <div className=" review__rating">
              <Rating value={review.rating} />
            </div>
            <div className=" review__text">{review.text}</div>
          </div>
        </div>
      </li>
    );
  });

  function handleChange(e) {
    if (e.target) {
      formData[e.target.name] = e.target.value;
      setformData({ ...formData });
    }
  }

  function handleSubmit(event) {
    formData.productId = props.productId ? props.productId : null;
    formData.customerId = JSON.parse(localStorage.getItem("identity"));
    if (formData.text != "" && formData.productId != null) {
      try {
        RestService.postReview(formData).then((res) => {
          toast[res.data.status](res.data.message);
          if (res.data.status === "success") {
            setformData(initReview);
            reviews.push(res.data.data);

            setreviews([...reviews]);
          }
        });
      } catch (err) {
        toast.error("Internal Server Error");
      }
    }
  }

  return (
    <div className="reviews-view">
      <div className="reviews-view__list">
        <h3 className="reviews-view__header">Customer Reviews</h3>

        <div className="reviews-list">
          <ol className="reviews-list__content">
            {loading ? (
              <Spinner
                style={{ width: "3rem", height: "3rem", alignSelf: "center" }}
                type="grow"
              />
            ) : (
              reviewsList
            )}
          </ol>
          <div className="reviews-list__pagination">
            {/* <Pagination current={5} siblings={10} total={50} /> */}
            {reviewPagination.totalPages === 0 ? (
              <h1 className="text-center">No Reviews Yet</h1>
            ) : (
              <ReactPaginate
                previousLabel={"<"}
                nextLabel={">"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={reviewPagination.totalPages}
                marginPagesDisplayed={4}
                pageRangeDisplayed={4}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              />
            )}
          </div>
        </div>
      </div>

      <form
        className="reviews-view__form"
        onSubmit={(event) => {
          event.preventDefault();

          handleSubmit(event);
        }}
      >
        <h5 className="reviews-view__header">
          {localStorage.getItem("token") !== null
            ? "Write A Review"
            : "Login to write a review"}
        </h5>
        {localStorage.getItem("token") !== null ? (
          <div className="row">
            <div className="col-12 col-lg-9 col-xl-8">
              <div className="form-row">
                <div className="form-group col-md-4">
                  <label htmlFor="review-stars">Review Stars</label>
                  <StarRatingInput
                    rating={formData.rating}
                    starRatedColor="#ffd333"
                    starDimension="25px"
                    starSpacing="3px"
                    changeRating={(e) => setformData({...formData, rating: e})}
                    numberOfStars={5}
                    name='rating'
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="review-text">Your Review</label>
                <textarea
                  onChange={handleChange}
                  value={formData.text}
                  name="text"
                  className="form-control"
                  id="review-text"
                  rows="6"
                />
              </div>
              <div className=" mb-0">
                <button type="submit" className="btn btn-primary btn-lg">
                  Post Your Review
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </form>
    </div>
  );
}

export default ProductTabReviews;
