// react
import React, {useEffect, useState} from 'react';

// third-party
import {Helmet} from 'react-helmet';
import RestService from "../../store/restService/restService";
// blocks
import BlockBrands from '../blocks/BlockBrands';
import BlockFeatures from '../blocks/BlockFeatures';

// data stubs
import products from '../../data/shopProducts';
import theme from '../../data/theme';
import bg1 from '../../assets/imgs/door2.jpg';
import {Fi24Hours48Svg, FiFreeDelivery48Svg, FiPaymentSecurity48Svg, FiTag48Svg} from "../../svg";
import {IMAGE_URL} from "../../constant/constants";


function HomePageTwo() {

    const [data, setData] = useState([]);
    const [video, setVideo] = useState([]);
    const [html, setHtml] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [cards, setCards] = useState([]);
    const [docs, setDocs] = useState([]);

    useEffect(() => {
        RestService.getWebPageComponentByPageId(6).then(res => {
            if (res.data.status == "success") {

                setData(res.data.data)
            }
        })
    }, [])


    function getWith(size) {
        let i = 50;
        if (size) {
            i = (size[0] / size[2]) * 100;
        }
        return `${i}%`
    }

    function getWith2 (size) {
        let i = 6;
        if(size){
            i = 12 / size[2];
        }
        return `${i}`
    }

    function getIcon(icon) {
        let tag = '';
        switch (icon) {
            case 'Fi24Hours48Svg':
                tag = <Fi24Hours48Svg />
                break;

            case 'FiTag48Svg':
                tag = <FiTag48Svg />
                break;

            case 'FiFreeDelivery48Svg':
                tag = <FiFreeDelivery48Svg />
                break;

            case 'FiPaymentSecurity48Svg':
                tag = <FiPaymentSecurity48Svg />
                break;
        }
        return tag
    }


    function getCardPreview(dataList) {
        return <div style={{ backgroundColor: "#fff" }}>
            <div className="container-fluid">
                <div className="row">
                    {
                        dataList.map(item => {
                            return <div className="col-3">
                                <div className="card p-4" style={{ backgroundColor: "#f7f7f7", border: "1px solid black" }}>
                                    <div className="text-center">
                                        <div style={{textAlign: "-webkit-center"}}>{getIcon(item.icon)}</div>
                                        <h3 className="mb-0">{item.mainHeading}</h3>
                                        <p>{item.subHeading}</p>
                                    </div>
                                </div>
                            </div>

                        })
                    }
                </div>
            </div>
        </div>
    }

    function getDocPreview(dataList) {
        return <div>
            {
                dataList.map(item => {
                    return <div style={{ margin: 40 }}>
                        <div className="text-center" >
                            <p className="my-2" style={{ fontSize: 22, color: 'rgb(241, 99, 12)', fontWeight: 'bold' }}>{item.header}</p>
                            <p className="my-1"><small>Click to View</small></p>
                            {getIcon(item.icon)}
                        </div>
                    </div>
                })
            }
        </div>
    }

    function getPhotoPreview(dataList) {
        return <div className="row">
            {
                dataList.map(item => {
                    return <div className={`col-lg-${getWith2(item.photoSize)}`}>
                        <div style={{ backgroundImage: `url(${IMAGE_URL}/${item.photoUrl})`, width: "100%" ,borderRadius: 20, marginBottom: 15, paddingLeft: 30, paddingTop: 30, height: 200 }}>
                            <h4 style={{ color: item.overlayMainTextColor }}>{item.overlayMainText}</h4>
                            <h1 style={{ color: item.overlaySubTextColor }}>{item.overlaySubText}</h1>
                            {item.buttonText != "" && item.buttonText != null ?
                                <button
                                    onClick={() => window.location.href = item.buttonLink}
                                    style={{ backgroundColor: "rgb(241, 99, 12)", borderRadius: 20, color: "rgb(255, 255, 255)", border: 'none', width: 100, padding: 5 }}
                                >{item.buttonText}</button> : null }
                        </div>
                    </div>
                })
            }
        </div>
    }

    function getVideoPreview(dataList) {
        return <div>
            {
                dataList.map(item => {
                    return <iframe width={getWith(item.videoPlayerSize)} height="550" src={item.videoUrl}>
                    </iframe>
                })
            }
        </div>
    }
    function getHtmlPreview(dataList) {
        return <div>
            {
                dataList.map(item => {
                    return <div dangerouslySetInnerHTML={{__html: item.htmlData}} />
                })
            }
        </div>
    }

    const getPreviewHTML = () => {

        let dataList = data.sort((a, b) => a.order - b.order)

        return <div>
            {
                dataList.map(item => {

                    if (item.webComponent.type === 'video') {
                        return getVideoPreview(item.webComponent.webVideos)
                    } else if (item.webComponent.type === 'photo') {
                        return getPhotoPreview(item.webComponent.webPhotos)
                    } else if (item.webComponent.type === 'html') {
                        return getHtmlPreview(item.webComponent.webHtmls)
                    } else if (item.webComponent.type === 'card') {
                        return getCardPreview(item.webComponent.webCards)
                    } else if (item.webComponent.type === 'doc') {
                        return getDocPreview(item.webComponent.webDocs)
                    }
                })
            }
        </div>
    }


    console.log("vidoe", html)

    const columns = [
        {
            title: 'Top Rated Products',
            products: products.slice(0, 3),
        },
        {
            title: 'Special Offers',
            products: products.slice(3, 6),
        },
        {
            title: 'Bestsellers',
            products: products.slice(6, 9),
        },
    ];

    return (
        <React.Fragment>
            <Helmet>
                <title>{`Home Page Two — ${theme.name}`}</title>
            </Helmet>

            {/* <div className="container"> */}
            {/*    <h2 className='py-4' style={{ color: '#F1630C', textAlign: 'center' }}>Welcome to Automation Products & Accessories Ltd.</h2> */}
            {/* </div> */}

            {/* <BlockSlideShow /> */}
            <div className="container">
            {getPreviewHTML()}
            </div>
            {/*{video && video.length > 0 ?*/}

            {/*    video.map(item => <div className="container mt-2">*/}
            {/*            <iframe*/}
            {/*                width={*/}
            {/*                    item.videoPlayerSize === "1/1" ? "100%" :*/}
            {/*                        item.videoPlayerSize === "1/2" ? "50%" :*/}
            {/*                            item.videoPlayerSize === "1/3" ? "75%" :*/}
            {/*                                item.videoPlayerSize == "1/4" ? "25%" : null*/}
            {/*                }*/}
            {/*                height="500px"*/}
            {/*                src={item.videoUrl}*/}
            {/*                frameBorder="0"*/}
            {/*                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"*/}
            {/*                allowFullScreen*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    )*/}
            {/*    : null*/}
            {/*}*/}
            {/*<div className="container pb-4" style={{marginBottom: 20}}>*/}
            {/*    <div className="row pb-2">*/}
            {/*        {html && html.length > 0 ?*/}
            {/*            html.map(item =>*/}
            {/*                <>*/}
            {/*                    <div className="col-md-3 text-justify">*/}
            {/*                        <p style={{fontSize: 16, fontWeight: 'bold', color: '#F1630C'}}>Specialist trade*/}
            {/*                            supplier of*/}
            {/*                            automatic door equipment for the independent companies within the commercial*/}
            {/*                            door*/}
            {/*                            market.</p>*/}
            {/*                    </div>*/}

            {/*                    <div className="col-md-9">*/}
            {/*                        <p>All members of APA have been in the automatic door industry for many years and*/}
            {/*                            have been a*/}
            {/*                            wide experience of many makes & models which spans the years since automatic*/}
            {/*                            doors where*/}
            {/*                            introduce to this country. APA are also suppliers of specialist automated door*/}
            {/*                            equipment, If*/}
            {/*                            you're looking high quality yet affordable automatic door equipment then you've*/}
            {/*                            come to the*/}
            {/*                            right place.</p>*/}
            {/*                    </div>*/}
            {/*                </>)*/}
            {/*            : null*/}
            {/*        }*/}


            {/*        <div className="col-md-12 text-center my-5">*/}
            {/*            <h2 style={{color: '#F1630C', textAlign: 'center'}}>Widest Product Range</h2>*/}
            {/*            <p>Lorem ipsum dolor sit amet, consectetur adipisicing</p>*/}
            {/*        </div>*/}

            {/*    </div>*/}
            {/*    <div className="row ">*/}
            {/*        <div className="col-lg-3 col-sm-6 text-center">*/}
            {/*            <img*/}
            {/*                src={require('../../assets/imgs/door2.jpg')}*/}
            {/*                className="img-responsive"*/}
            {/*                height={200}*/}
            {/*                style={{*/}
            {/*                    borderRadius: 20, marginBottom: 15, width: '100%', resize: 'both',*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className="col-lg-3 col-sm-6 text-center">*/}
            {/*            <img*/}
            {/*                src={require('../../assets/imgs/door3.jpg')}*/}
            {/*                className="img-responsive"*/}
            {/*                height={200}*/}
            {/*                style={{borderRadius: 20, width: '100%', marginBottom: 15}}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className="col-lg-6">*/}
            {/*            <div style={{*/}
            {/*                backgroundColor: '#f1630c', borderRadius: 20, marginBottom: 15, padding: 30, height: 200,*/}
            {/*            }}*/}
            {/*            >*/}
            {/*                <p style={{color: '#fff', fontWeight: 'bold'}}>*/}
            {/*                    {' '}*/}
            {/*                    High quality, affordable,*/}
            {/*                    <br/>*/}
            {/*                    {' '}*/}
            {/*                    Automatic door*/}
            {/*                </p>*/}
            {/*                <h1 style={{color: '#fff'}}>EQUIPMENTS</h1>*/}
            {/*            </div>*/}
            {/*        </div>*/}


            {/*        <div className="col-lg-6">*/}
            {/*            <div style={{*/}
            {/*                backgroundImage: `url(${bg1})`,*/}
            {/*                borderRadius: 20,*/}
            {/*                marginBottom: 15,*/}
            {/*                paddingLeft: 30,*/}
            {/*                paddingTop: 30,*/}
            {/*                verticalAlign: 'center',*/}
            {/*                height: 200,*/}
            {/*            }}*/}
            {/*            >*/}
            {/*                <h4>Automatic</h4>*/}
            {/*                <h1 style={{}}>DOOR SYSTEMS</h1>*/}
            {/*                <button style={{*/}
            {/*                    backgroundColor: '#f1630c',*/}
            {/*                    borderRadius: 20,*/}
            {/*                    color: '#ffffff',*/}
            {/*                    border: 'none',*/}
            {/*                    width: 100,*/}
            {/*                    padding: 5,*/}
            {/*                }}*/}
            {/*                >*/}
            {/*                    Browse*/}
            {/*                </button>*/}
            {/*            </div>*/}
            {/*        </div>*/}

            {/*        <div className="col-lg-3 col-sm-6 text-center">*/}
            {/*            <img*/}
            {/*                src={require('../../assets/imgs/door4.jpg')}*/}
            {/*                className="img-responsive"*/}
            {/*                height={200}*/}
            {/*                style={{borderRadius: 20, marginBottom: 15, width: '100%'}}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*        <div className="col-lg-3 col-sm-6 text-center">*/}
            {/*            <img*/}
            {/*                src={require('../../assets/imgs/doors-sliding.jpg')}*/}
            {/*                height={200}*/}
            {/*                style={{borderRadius: 20, marginBottom: 15, width: '100%'}}*/}
            {/*            />*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}


            {/*<BlockFeatures layout="boxed"/>*/}

            {/*/!* <BlockTabbedProductsCarousel title="Featured Products" layout="grid-5" rows={2} /> *!/*/}

            {/*/!* <BlockBanner /> *!/*/}

            {/*/!* <BlockProducts *!/*/}
            {/*/!*    title="Bestsellers" *!/*/}
            {/*/!*    layout="large-last" *!/*/}
            {/*/!*    featuredProduct={products[0]} *!/*/}
            {/*/!*    products={products.slice(1, 7)} *!/*/}
            {/*/!* /> *!/*/}

            {/*/!* <BlockCategories title="Popular Categories" layout="compact" categories={categories} /> *!/*/}

            {/*/!* <BlockTabbedProductsCarousel title="New Arrivals" layout="grid-5" /> *!/*/}

            {/*/!* <BlockPosts title="Latest News" layout="grid-nl" posts={posts} /> *!/*/}

            {/*<BlockBrands/>*/}

            {/*/!* <BlockProductColumns columns={columns} /> *!/*/}
        </React.Fragment>
    );
}

export default HomePageTwo;
