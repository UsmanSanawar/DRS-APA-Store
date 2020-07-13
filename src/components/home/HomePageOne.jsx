// react
import React from 'react';
// third-party
import {Helmet} from 'react-helmet';
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


function HomePageOne() {
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
                <title>{`Home Page — ${theme.name}`}</title>
            </Helmet>


            <div className="container">
                <h2 className="animate__flipInX py-4" style={{ color: '#F1630C', textAlign: 'center' }}>Welcome to Auto Door Spares</h2>
            </div>

            <BlockSlideShow

            // withDepartments
            //above being used as side space for dropdown
            />

{/*            <div className="container">*/}
{/*                <h2 style={{ color: '#F1630C', textAlign: 'center' }}>Widest Product Range</h2>*/}
{/*                <div className="row" style={{ padding: "40px 0px" }}>*/}
{/*                    <div className="col-md-4 col-sm-12 col-xs-12">*/}
{/*                        <p style={{ fontWeight: 'bold', color: '#F1630C', fontSize: 19 }}>*/}
{/*                            Specialist trade supplier of automatic door equipment for the independent companies with in the commercial door market*/}
{/*</p>*/}
{/*                    </div>*/}
{/*                    <div className="col-sm-12 col-xs-12 col-md-8">*/}
{/*                        <p style={{ fontSize: 20 }}>*/}
{/*                            All members of APA have been in the automatic door industry for many years and have a wide experience of*/}
{/*                            the many makes & models which span the years since automatic doors where introduced to this country, APA*/}
{/*                            are also suppliers of specialist automated door equipment, If you’re looking for high quality yet affordable*/}
{/*                            automatic door equipment then you’ve come to the right place.*/}
{/*</p>*/}
{/*                    </div>*/}

{/*                </div>*/}

{/*            </div>*/}

            <div className="container">
                <h2 style={{ color: '#F1630C', textAlign: 'center' }}>Widest Product Range</h2>
                <p style={{ fontSize: 20, textAlign: 'center' }}>Lorem ipsum cosa fsdf dsafeosdaf dsavanv</p>
                <div className="row ">
                    <div className="col-lg-3 col-sm-6 text-center">
                        <img
                        src={require('../../assets/imgs/door2.jpg')}
                        className="img-responsive"
                        height={200}
                         style={{ borderRadius: 20, marginBottom: 15 , width: '100%', resize:'both'}} /></div>
                    <div className="col-lg-3 col-sm-6 text-center">
                        <img src={require('../../assets/imgs/door3.jpg')}
                        className="img-responsive"
                        height={200} style={{ borderRadius: 20,width: '100%', marginBottom: 15 }} /></div>
                    <div className="col-lg-6">
                        <div style={{ backgroundColor: '#F1630C', borderRadius: 20, marginBottom: 15, padding: 50, height: 200, }}>
                            <p style={{ color: '#fff', fontWeight: 'bold' }}> > High quality affordable <br /> automatic door</p>
                            <h1 style={{ color: '#fff' }}>EQUIPMENTS</h1>
                        </div>
                    </div>


                    <div className="col-lg-6">
                        <div style={{ backgroundColor: 'gray', borderRadius: 20, marginBottom: 15, padding: 40, height: 200, }}>
                        <h2 style={{ color: '#fff' }}>Why Chose Us</h2>
                        <ul>
                            <li style={{color: '#fff', fontWeight: 'bold'}}>Quality</li>
                            <li style={{color: '#fff', fontWeight: 'bold'}}>Affordable Products</li>
                            <li style={{color: '#fff', fontWeight: 'bold'}}>Text 1</li>
                            <li style={{color: '#fff', fontWeight: 'bold'}}>Text 2</li>
                        </ul>

                        </div>
                    </div>

                    <div className="col-lg-3 col-sm-6 text-center">
                        <img src={require('../../assets/imgs/door4.jpg')}
                        className="img-responsive" height={200}
                        style={{ borderRadius: 20, marginBottom: 15,width: '100%', }}  /></div>
                    <div className="col-lg-3 col-sm-6 text-center">
                        <img src={require('../../assets/imgs/doors-sliding.jpg')}
                         height={200}
                         style={{ borderRadius: 20, marginBottom: 15 ,width: '100%',}} /></div>
                </div>
            </div>

            <BlockFeatures/>

            <BlockTabbedProductsCarousel title="Featured Products" layout="grid-4"/>

            <BlockBanner/>

            <BlockProducts
                title="Bestsellers"
                layout="large-first"
                featuredProduct={products[0]}
                products={products.slice(1, 7)}
            />

            <BlockCategories title="Popular Categories" layout="classic" categories={categories}/>

            <BlockTabbedProductsCarousel title="New Arrivals" layout="horizontal" rows={2}/>

            <BlockPosts title="Latest News" layout="list-sm" posts={posts}/>

            <BlockBrands/>

            <BlockProductColumns columns={columns}/>
        </React.Fragment>
    );
}

export default HomePageOne;
