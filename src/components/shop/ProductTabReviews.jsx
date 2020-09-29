// react
import React, { useState, useEffect } from 'react';

// application
import Pagination from '../shared/Pagination';
import Rating from '../shared/Rating';

// data stubs
// import reviews from '../../data/shopProductReviews';
import RestService from '../../store/restService/restService';
import { toast } from 'react-toastify';
import ReactPaginate from 'react-paginate';
import {Spinner} from "reactstrap"

function ProductTabReviews(props) {

    let initReview = { rating: 1, text: '', productId: null }

    const [loading, setloading] = useState(true);
    const [formData, setformData] = useState(initReview);
    const [reviews, setreviews] = useState([]);
    const [reviewPagination, setreviewPagination] = useState({currentPage: 1,pageSize: 10, totalCount: 10, totalPages: 2});


    useEffect(() => {
        if (props.productId) {
            getReviews()
        }
    }, [props.productId])


   function getReviews(currentPage){
    setloading(true)
    try {
        RestService.getReviews(props.productId,currentPage).then(res => {
            if(res.data.status === 'success'){
                setreviews(res.data.data)
                setreviewPagination(JSON.parse(res.headers["x-pagination"]))
                console.log(res.data, JSON.parse(res.headers["x-pagination"]),' 9000000099900');
                
            }
            setloading(false)
        })
    }catch(err){
        toast.error('Internal Server Error')
        setloading(false)
    }
    }



    function handlePageClick(e) {
        console.log(e, 'paginatoins e');
        getReviews(e.selected + 1)
    }


    const reviewsList = reviews.map((review, index) => {
    
      return <li key={index} className="reviews-list__item">
            <div className="review">
                <div className="review__avatar"><img src={'images/avatars/avatar-1.jpg'} alt="" /></div>
                <div className=" review__content">
                    <div className=" review__author">Dumy Text</div>
                    <div className=" review__rating">
                        <Rating value={review.rating} />
                    </div>
                    <div className=" review__text">{review.text}</div>
                </div>
            </div>
        </li>
    });

    function handleChange(e) {
        if (e.target) {
            formData[e.target.name] = e.target.value;
            setformData({ ...formData })
        }
    }

    function handleSubmit(event) {
        formData.productId = props.productId ? props.productId : null;
        if (formData.text != '' && formData.productId != null) {
            try {
                RestService.postReview(formData).then(res => {
                    toast[res.data.status](res.data.message)
                    if (res.data.status === 'success') {
                        setformData(initReview)
                        reviews.push(res.data.data)
                        
                        setreviews([...reviews])
                    }
                })
            } catch (err) {
                toast.error('Internal Server Error')
            }
        }
    }


    console.log(reviews, 'reviews reviews reviews');
    


    return (
        <div className="reviews-view">
            <div className="reviews-view__list">
                <h3 className="reviews-view__header">Customer Reviews</h3>

                <div className="reviews-list">
                    <ol className="reviews-list__content">

                        {
                            loading ? <Spinner style={{ width: '3rem', height: '3rem', alignSelf: "center" }} type="grow" /> : reviewsList
                        }
                    </ol>
                    <div className="reviews-list__pagination">
                        {/* <Pagination current={5} siblings={10} total={50} /> */}

                        <ReactPaginate
                            previousLabel={"prev"}
                            nextLabel={"next"}
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
                    </div>
                </div>
            </div>

            <form className="reviews-view__form" onSubmit={(event) => {
                event.preventDefault();

                handleSubmit(event)
            }}>
                <h3 className="reviews-view__header">Write A Review</h3>
                <div className="row">
                    <div className="col-12 col-lg-9 col-xl-8">
                        <div className="form-row">
                            <div className="form-group col-md-4">
                                <label htmlFor="review-stars">Review Stars</label>
                                <select id="review-stars" name="rating" className="form-control" onChange={handleChange} value={formData.rating}>
                                    <option value={5}>5 Stars Rating</option>
                                    <option value={4}>4 Stars Rating</option>
                                    <option value={3}>3 Stars Rating</option>
                                    <option value={2}>2 Stars Rating</option>
                                    <option value={1}>1 Stars Rating</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="review-text">Your Review</label>
                            <textarea onChange={handleChange} value={formData.text} name="text" className="form-control" id="review-text" rows="6" />
                        </div>
                        <div className=" mb-0">
                            <button type="submit" className="btn btn-primary btn-lg">Post Your Review</button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default ProductTabReviews;
