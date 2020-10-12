// react
import React, { Component } from 'react';
import {Redirect} from "react-router-dom"

// third-party
import PropTypes from 'prop-types';

// application
// import products from '../../data/shopProducts';

// data stubs
import BlockProductsCarousel from './BlockProductsCarousel';


export default class BlockTabbedProductsCarousel extends Component {
    timeout;

    constructor(props) {
        super(props);


        this.state = {
            products: this.props.products ? this.props.products.slice() : [],
            loading: false,
            groups: [
                { id: 1, name: 'View All', current: false },
                // { id: 2, name: 'Power Tools', current: false },
                // { id: 3, name: 'Hand Tools', current: false },
                // { id: 4, name: 'Plumbing', current: false },
            ],
        };
    }


    componentDidMount() {
        if (this.props.products) {
            this.setState({
                products:  this.props.products.slice()
            })
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.products !== this.props.products){
            this.setState({
                products:  this.props.products.slice()
            })
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    handleChangeGroup = (newCurrentGroup) => {
        clearTimeout(this.timeout);

        const { groups } = this.state;
        const currentGroup = groups.find((group) => group.current);

        if (currentGroup && currentGroup.id === newCurrentGroup.id) {
            return;
        }

        this.setState((state) => (
            {
                loading: true,
                groups: state.groups.map((group) => (
                    { ...group, current: group.id === newCurrentGroup.id }
                )),
            }
        ));

        // sending request to server, timeout is used as a stub
        this.timeout = setTimeout(() => {
            this.setState((state) => {
                // this is only for demo purpose
                const itemsArray = state.products.slice();
                const newItemsArray = [];
                while (itemsArray.length > 0) {
                    const randomIndex = Math.floor(Math.random() * itemsArray.length);
                    const randomItem = itemsArray.splice(randomIndex, 1)[0];
                    newItemsArray.push(randomItem);
                }

                return {
                    products: newItemsArray,
                    loading: false,
                };
            });
        }, 500);
    };

    redirectToProductPage = (item) => {
        console.log(item.name, "ssssse")
        if (item.name === "View All") {
            return this.props.history.push("/store/category-list")
        }
    }

    render() {

        console.log(this.props, "featuredList");

        return (
            <BlockProductsCarousel
                {...this.props}
                {...this.state}
                // onGroupClick={this.handleChangeGroup}
                onGroupClick={this.redirectToProductPage}
            />
        );
    }
}

BlockTabbedProductsCarousel.propTypes = {
    title: PropTypes.string.isRequired,
    layout: PropTypes.oneOf(['grid-4', 'grid-4-sm', 'grid-5', 'horizontal']),
    rows: PropTypes.number,
    withSidebar: PropTypes.bool,
};

BlockTabbedProductsCarousel.defaultProps = {
    layout: 'grid-4',
    rows: 1,
    withSidebar: false,
};
