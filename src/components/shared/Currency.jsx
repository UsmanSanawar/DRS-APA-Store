// react
import React from 'react';

// third-party
import PropTypes from 'prop-types';
import { connect } from 'react-redux';


function Currency(props) {
    const { value, currency, currentCurrency } = props;
    const { symbol } = currency || currentCurrency;

    return <React.Fragment>{`${"£"}${value ? value.toFixed(2) : 0}`}</React.Fragment>;
}

Currency.propTypes = {
    /** price value */
    value: PropTypes.number.isRequired,
    /** currency object, specify to override currentCurrency */
    currency: PropTypes.object,
    /** currency object */
    currentCurrency: PropTypes.object,
};

const mapStateToProps = (state) => ({
    currentCurrency: state.currency,
});

export default connect(mapStateToProps)(Currency);
