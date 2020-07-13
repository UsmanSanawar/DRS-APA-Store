// react
import React from 'react';

// third-party
import { Helmet } from 'react-helmet';

// blocks
import BlockBanner from '../blocks/BlockBanner';
import BlockBrands from '../blocks/BlockBrands';
import BlockCategories from '../blocks/BlockCategories';
import BlockFeatures from '../blocks/BlockFeatures';
import BlockPosts from '../blocks/BlockPosts';
import BlockProductColumns from '../blocks/BlockProductColumns';
import BlockProducts from '../blocks/BlockProducts';
import BlockSlideShow from '../blocks/BlockSlideShow';
import BlockTabbedProductsCarousel from '../blocks/BlockTabbedProductsCarousel';

// data stubs
import categories from '../../data/shopBlockCategories';
import posts from '../../data/blogPosts';
import products from '../../data/shopProducts';
import theme from '../../data/theme';
import bg1 from "../../assets/imgs/door2.jpg"


function HomePageTwo() {
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

            <div className="container">
                <h2 className='py-4' style={{ color: '#F1630C', textAlign: 'center' }}>Welcome to Automation Products & Accessories Ltd.</h2>
            </div>

            <BlockSlideShow />

            <div className="container pb-4" style={{ marginBottom: 20 }}>
                <div className="row pb-2">
                    <div className="col-md-3 text-justify">
                            <p style={{ fontSize: 16, fontWeight:"bold", color:"#F1630C" }}>Specialist trade supplier of automatic door equipment for the independent companies within the commercial door market.</p>
                    </div>
                    <div className="col-md-9">
                        <p>All members of APA have been in the automatic door industry for many years and have been a wide experience of many makes & models which spans the years since automatic doors where introduce to this country. APA are also suppliers of specialist automated door equipment, If you're looking high quality yet  affordable automatic door equipment then you've come to the right place.</p>
                    </div>

                    <div className='col-md-12 text-center my-5'>
                        <h2 style={{ color: '#F1630C', textAlign: 'center' }}>Widest Product Range</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing</p>
                    </div>

                </div>
                <div className="row ">
                    <div className="col-lg-3 col-sm-6 text-center"><img
                        src={require('../../assets/imgs/door2.jpg')}
                        className="img-responsive"
                        height={200}
                        style={{ borderRadius: 20, marginBottom: 15, width: '100%', resize: 'both' }} /></div>
                    <div className="col-lg-3 col-sm-6 text-center">
                        <img src={require('../../assets/imgs/door3.jpg')}
                             className="img-responsive"
                             height={200} style={{ borderRadius: 20, width: '100%', marginBottom: 15 }} /></div>
                    <div className="col-lg-6">
                        <div style={{ backgroundColor: '#f1630c', borderRadius: 20, marginBottom: 15, padding: 30, height: 200, }}>
                            <p style={{ color: '#fff', fontWeight: 'bold' }}> > High quality affordable <br /> automatic door</p>
                            <h1 style={{ color: '#fff' }}>EQUIPMENTS</h1>
                        </div>
                    </div>


                    <div className="col-lg-6">
                        <div style={{ backgroundImage: `url(${bg1})`,  borderRadius: 20, marginBottom: 15, paddingLeft: 30,paddingTop: 30, verticalAlign:'center', height: 200, }}>
                            <h4>Automatic</h4>
                            <h1 style={{ }}>DOOR SYSTEMS</h1>
                            <button style={{backgroundColor: '#f1630c', borderRadius: 20, color:'#ffffff', border:'none', width: 100, padding: 5}} >Browse</button>
                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 text-center">
                        <img src={require('../../assets/imgs/door4.jpg')}
                             className="img-responsive" height={200}
                             style={{ borderRadius: 20, marginBottom: 15, width: '100%', }} /></div>
                    <div className="col-lg-3 col-sm-6 text-center">
                        <img src={require('../../assets/imgs/doors-sliding.jpg')}
                             height={200}
                             style={{ borderRadius: 20, marginBottom: 15, width: '100%', }} /></div>
                </div>
            </div>



            <BlockFeatures layout="boxed" />

            {/*<BlockTabbedProductsCarousel title="Featured Products" layout="grid-5" rows={2} />*/}

            {/*<BlockBanner />*/}

            {/*<BlockProducts*/}
            {/*    title="Bestsellers"*/}
            {/*    layout="large-last"*/}
            {/*    featuredProduct={products[0]}*/}
            {/*    products={products.slice(1, 7)}*/}
            {/*/>*/}

            {/*<BlockCategories title="Popular Categories" layout="compact" categories={categories} />*/}

            {/*<BlockTabbedProductsCarousel title="New Arrivals" layout="grid-5" />*/}

            {/*<BlockPosts title="Latest News" layout="grid-nl" posts={posts} />*/}

            <BlockBrands />

            {/*<BlockProductColumns columns={columns} />*/}
        </React.Fragment>
    );
}

export default HomePageTwo;
