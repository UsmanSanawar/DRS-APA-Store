// react
import React, { useCallback, useEffect, useState } from 'react';

// application
import { Search20Svg } from '../../svg';
import RestService from '../../store/restService/restService';
import { debounce } from 'lodash';
import { Card, Spinner } from 'reactstrap';
import { IMAGE_URL } from '../../constant/constants';
import { Link } from 'react-router-dom';

function Search() {
    const [searchString, setSearchString] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const productSearchAPI = (string) => {
        setLoading(true)
        setResults([])
        RestService.getProductsBySearch(string).then(res => {
            setLoading(false)
            if (res.data.status === 'success') {
                setResults(res.data.data)
            }
            console.log(res, "propseeee")
        })
    }
    const sendQuery = query => productSearchAPI(query);
    const debounceQuery = useCallback(debounce(q => sendQuery(q), 400), []);

    return (
        <>
            <div className="search">
                <form onSubmit={(e) => e.preventDefault()} className="search__form">
                    <input
                        className="search__input"
                        name="search"
                        onChange={(e) => {
                            setSearchString(e.target.value);
                            debounceQuery(e.target.value);
                        }}
                        value={searchString}
                        placeholder="Search for products"
                        aria-label="Site search"
                        autoComplete="off"
                    />
                    <button type="button" className="search__button disabled">
                        {loading ? <Spinner style={{height: 20, width: 20, color: "#f6965c"}} /> : <Search20Svg />}
                    </button>
                    <div className="search__border" />
                </form>


                <div style={{ position: "absolute" }}>
                    {results.length > 0 &&
                        <>
                            <div
                                className="container m-0 col-8"
                                style={{
                                    zIndex: 110000,
                                    height: 500,
                                    overflowY: "scroll",
                                    overflowX: "hidden",
                                    backgroundColor: '#929394d9'
                                }}> {results.map(item => (
                                    <Card style={{ backgroundColor: "#ffffff" }} className="row m-0 p-2">
                                        <div className="row">
                                            <div className="col-2">
                                                <Link to={`/store/product/${item.productId}`}>
                                                    <img
                                                        style={{ height: 80, width: '100%' }}
                                                        src={`${IMAGE_URL}/${item.image}`}
                                                        alt="product" />
                                                </Link>
                                            </div>

                                            <div className="col-10">
                                                <Link style={{color: '#f6965c'}} to={`/store/product/${item.productId}`}>
                                                    <p className="mb-0">
                                                        <b>{item.productName}</b>
                                                    </p>
                                                </Link>
                                                <p className="text-success">£{item.price}</p>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </>}
                </div>
            </div>
        </>
    );
}

export default Search;
