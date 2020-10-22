// react
import React, { Component } from 'react';

// third-party
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// application
import departmentsAria from '../../services/departmentsArea';
import SlickWithPreventSwipeClick from '../shared/SlickWithPreventSwipeClick';
import RestService from '../../store/restService/restService';
import { IMAGE_URL } from "../../constant/constants";


const slickSettings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
};

export default class BlockSlideShow extends Component {
    constructor(props) {
        super(props)

        this.state = {
            slides: [],
            carousal: {}
        }
    }


    departmentsAreaRef = null;
    media = window.matchMedia('(min-width: 992px)');

    componentDidMount() {
        if (this.media.addEventListener) {
            this.media.addEventListener('change', this.onChangeMedia);
        } else {
            this.media.addListener(this.onChangeMedia);
        }

        RestService.getWebCarousal().then(res => {
            // buttonColor: "#e218cb"
            // buttonText: "Buy"
            // headerText: "SomeHeaderText"
            // headerTextColor: "#ee1717"
            // isActive: true
            // pageSlug: "store"
            // showButton: true
            // subText: "SomeSubText"
            // subTextColor: "#34f10e"

            if (res.data.status === "success") {
                if (res.data.data.length > 0) {
                    let array = [];
                    let carousal = res.data.data[0];
                    // eslint-disable-next-line array-callback-return
                    carousal.webCarousalPhotos.map(item => {
                        array.push({
                            title: carousal.headerText ? carousal.headerText : "",
                            text: carousal.subText ? carousal.subText : "",
                            image_classic: `${IMAGE_URL}/carousalPhotos/${item.photoURL}`,
                            image_full: `${IMAGE_URL}/carousalPhotos/${item.photoURL}`,
                            image_mobile: `${IMAGE_URL}/carousalPhotos/${item.photoURL}`,
                        })
                    })
                    return this.setState({ slides: array, carousal: carousal })
                }
            }
        })
    }

    componentWillUnmount() {
        departmentsAria.area = null;

        if (this.media.removeEventListener) {
            this.media.removeEventListener('change', this.onChangeMedia);
        } else {
            this.media.removeListener(this.onChangeMedia);
        }
    }

    onChangeMedia = () => {
        if (this.media.matches) {
            departmentsAria.area = this.departmentsAreaRef;
        }
    };

    setDepartmentsAreaRef = (ref) => {
        this.departmentsAreaRef = ref;

        if (this.media.matches) {
            departmentsAria.area = this.departmentsAreaRef;
        }
    };

    render() {
        const { withDepartments } = this.props;
        const { carousal } = this.state;

        const blockClasses = classNames(
            'block-slideshow block',
            {
                'block-slideshow--layout--full': !withDepartments,
                'block-slideshow--layout--with-departments': withDepartments,
            },
        );

        const layoutClasses = classNames(
            'col-12',
            {
                'col-lg-12': !withDepartments,
                'col-lg-9': withDepartments,
            },
        );

        const slides = this.state.slides.map((slide, index) => {
            const image = withDepartments ? slide.image_classic : slide.image_full;

            return (
                <div key={index} className="block-slideshow__slide">
                    <div
                        className="block-slideshow__slide-image block-slideshow__slide-image--desktop"
                        style={{
                            backgroundImage: `url(${image})`,
                        }}
                    />
                    <div
                        className="block-slideshow__slide-image block-slideshow__slide-image--mobile"
                        style={{
                            backgroundImage: `url(${slide.image_mobile})`,
                        }}
                    />
                    <div className="block-slideshow__slide-content">
                        <div
                            className="block-slideshow__slide-title"
                            style={{ color: `${carousal.headerTextColor}` }}
                            dangerouslySetInnerHTML={{ __html: slide.title }}
                        />
                        <div
                            className="block-slideshow__slide-text"
                            style={{ color: `${carousal.subTextColor}` }}
                            dangerouslySetInnerHTML={{ __html: slide.text }}
                        />
                        <div className="block-slideshow__slide-button">
                            {carousal.showButton ?
                                <Link to="/" style={{ backgroundColor: `${carousal.buttonColor}` }} className="btn btn-primary btn-lg border-0">{carousal.buttonText}</Link>
                                : null
                            }
                        </div>

                    </div>
                </div>
            );
        });

        return (
            <div className={blockClasses}>
                <div className="container">
                    <div className="row">
                        {withDepartments && (
                            <div className="col-3 d-lg-block d-none" ref={this.setDepartmentsAreaRef} />
                        )}

                        <div className={layoutClasses}>
                            <div className="block-slideshow__body">
                                <SlickWithPreventSwipeClick {...slickSettings}>
                                    {slides}
                                </SlickWithPreventSwipeClick>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

BlockSlideShow.propTypes = {
    withDepartments: PropTypes.bool,
};

BlockSlideShow.defaultProps = {
    withDepartments: false,
};
