// react
import React from 'react';

// data stubs
import specification from '../../data/shopProductSpec';
import Product from '../shared/Product';


function ProductTabSpecification(props) {

    return (
        <div className="spec">
            <h3 className="spec__header">Specification</h3>
            <div className="spec__section">


            <h4 className="spec__section-title">General</h4>
                <div  className="spec__row">
                    <div className="spec__name">Weight</div>
                    <div className="spec__value">{`${props.product.weight}  ${props.product.weightUnitName}`}</div>
                </div>


<br /><br />

                <h4 className="spec__section-title">Dimensions</h4>
                <div  className="spec__row">
                    <div className="spec__name">Length</div>
                    <div className="spec__value">{`${props.product.length} ${props.product.lengthUnitName}`}</div>
                </div>

                <div  className="spec__row">
                    <div className="spec__name">Width</div>       
                    <div className="spec__value">{`${props.product.width} ${props.product.lengthUnitName}`}</div>
                </div>

                <div  className="spec__row">
                    <div className="spec__name">Height</div>
                    <div className="spec__value">{`${props.product.height} ${props.product.lengthUnitName}`}</div>
                </div>

            </div>
            {/* <div className="spec__disclaimer">
                Information on technical characteristics, the delivery set, the country of
                manufacture and the appearance of the goods is for reference only and is based on
                the latest information available at the time of publication.
            </div> */}
        </div>
    );
}

export default ProductTabSpecification;
