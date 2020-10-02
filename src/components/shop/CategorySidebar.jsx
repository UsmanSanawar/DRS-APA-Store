// react
import React, { useEffect, useRef, useState } from "react";

// third-party
import classNames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// application
import { Cross20Svg } from "../../svg";
import { sidebarClose } from "../../store/sidebar";

// widgets
import WidgetFilters from "../widgets/WidgetFilters";
import WidgetProducts from "../widgets/WidgetProducts";

// data stubs
import filters from "../../data/shopFilters";
import products from "../../data/shopProducts";
import RestService from "../../store/restService/restService";
import {} from "../../store/webView.js";

function CategorySidebar(props) {
   
    const [manufacturer, setManufacturer] = useState([]);
    const [category, setCategory] = useState([]);
    const PriceFilter = {
        id: 2,
        name: 'Price',
        type: 'price',
        options: {
            min: 1,
            max: 3000,
            from: 1,
            to: 1000,
        },
    };
    useEffect(() => {
        RestService.getAllManufacturer().then((res) => {
            if (res.data.status === "success") {
                let Data = res.data.data;

                function manufactureItems() {
                    let manufacArray = [];
                    Data.map((item) => {
                        manufacArray.push({
                            id: item.manufacturerId,
                            label: item.manufacturerName,
                            // count: 7,
                            checked: false,
                            disabled: false,
                        });
                    });
                    return manufacArray;
                }

                const ManuObject = {
                    id: 3,
                    name: "Manufacturers",
                    type: "checkbox",
                    options: {
                        items: manufactureItems(),
                    },
                };

                setManufacturer(ManuObject);
            }
        });

        RestService.getAllCategories().then((res) => {
            if (res.data.status === "success") {
                let Data = res.data.data;
                function categoryItems() {
                    let catArray = [];
                    Data.map((item) => {
                        let categoryitem;
                        if (item.parentCategoryId == null) {
                            categoryitem = {
                                id: item.productCategoryId,
                                type: "parent",
                                // count: 75,
                                name: item.name
                            };
                        } else {
                            categoryitem = {
                                id: item.productCategoryId,
                                type: "child",
                                // count: 75,
                                name: item.name
                            }
                        }

                        catArray.push(categoryitem);
                    });
                    return catArray;
                }

                let Object = {
                    id: 1,
                    name: "Categories",
                    type: "categories",
                    options: {
                        items: categoryItems()
                    },
                };

                setCategory(Object)
            }
        });
    }, []);

    console.log([manufacturer, PriceFilter, category], "dsadasdasd");

    const { sidebarClose, sidebarState, offcanvas } = props;

    const classes = classNames("block block-sidebar", {
        "block-sidebar--open": sidebarState.open,
        "block-sidebar--offcanvas--always": offcanvas === "always",
        "block-sidebar--offcanvas--mobile": offcanvas === "mobile",
    });

    const backdropRef = useRef(null);
    const bodyRef = useRef(null);

    useEffect(() => {
        const media = matchMedia("(max-width: 991px)");
        let changedByMedia = false;

        const onChange = () => {
            if (offcanvas === "mobile") {
                if (sidebarState.open && !media.matches) {
                    sidebarClose();
                }
                // this is necessary to avoid the transition hiding the sidebar
                if (!sidebarState.open && media.matches && changedByMedia) {
                    /** @var {HTMLElement} */
                    const backdrop = backdropRef.current;
                    /** @var {HTMLElement} */
                    const body = bodyRef.current;

                    backdrop.style.transition = "none";
                    body.style.transition = "none";

                    backdrop.getBoundingClientRect(); // force reflow

                    backdrop.style.transition = "";
                    body.style.transition = "";
                }
            }
        };

        if (media.addEventListener) {
            media.addEventListener("change", onChange);
        } else {
            media.addListener(onChange);
        }

        onChange();

        changedByMedia = true;

        return () => {
            if (media.removeEventListener) {
                media.removeEventListener("change", onChange);
            } else {
                media.removeListener(onChange);
            }
        };
    }, [offcanvas, sidebarState.open, sidebarClose]);

    useEffect(() => {
        if (sidebarState.open) {
            const width = document.body.clientWidth;

            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${document.body.clientWidth - width}px`;
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
    }, [sidebarState.open]);

    return (
        <div className={classes}>
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className="block-sidebar__backdrop" ref={backdropRef} onClick={() => sidebarClose()} />
            <div className="block-sidebar__body" ref={bodyRef}>
                <div className="block-sidebar__header">
                    <div className="block-sidebar__title">Filters</div>
                    <button className="block-sidebar__close" type="button" onClick={() => sidebarClose()}>
                        <Cross20Svg />
                    </button>
                </div>
                <div className="block-sidebar__item">
                    <WidgetFilters title="Filters" onChange={props.onChange} filters={[manufacturer, PriceFilter ,category]} offcanvas={offcanvas} />
                </div>
                {/* {offcanvas !== 'always' && (
                        <div className="block-sidebar__item d-none d-lg-block">
                            <WidgetProducts title="Latest Products" products={products.slice(0, 5)} />
                        </div>
                    )} */}
            </div>
        </div>
    );
}

CategorySidebar.propTypes = {
    /**
     * indicates when sidebar bar should be off canvas
     */
    offcanvas: PropTypes.oneOf(["always", "mobile"]),
};

CategorySidebar.defaultProps = {
    offcanvas: "mobile",
};

const mapStateToProps = (state) => ({
    sidebarState: state.sidebar,
});

const mapDispatchToProps = {
    sidebarClose,
};

export default connect(mapStateToProps, mapDispatchToProps)(CategorySidebar);
