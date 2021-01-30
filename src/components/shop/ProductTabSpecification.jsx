// react
import React, { useEffect, useState } from "react";

// data stubs

function ProductTabSpecification(props) {
  const [product, setProduct] = useState({});
  useEffect(() => {
    setProduct(props.product)
    
    }, [props.product]);


  return (
    <div className="spec">
      <h3 className="spec__header">Specification</h3>
      <div className="spec__section">
        <h4 className="spec__section-title">General</h4>
        <div className="spec__row">
          <div className="spec__name">Weight</div>
          <div className="spec__value">{`${parseFloat(product.newWeight || product.weight).toFixed(2)}  Kg`}</div>
        </div>

        <br />
        <br />

        <h4 className="spec__section-title">Dimensions</h4>
        <div className="spec__row">
          <div className="spec__name">Length</div>
          <div className="spec__value">{`${
            props.product.length ? parseFloat(props.product.length).toFixed(2) + "cm" : "-"
          }`}</div>
        </div>

        <div className="spec__row">
          <div className="spec__name">Width</div>
          <div className="spec__value">{`${
            props.product.width ? parseFloat(props.product.width).toFixed(2) + "cm" : "-"
          }`}</div>
        </div>

        <div className="spec__row">
          <div className="spec__name">Height</div>
          <div className="spec__value">{`${
            props.product.height ? parseFloat(props.product.height).toFixed(2) + "cm" : "-"
          }`}</div>
        </div>
      </div>
    </div>
  );
}

export default ProductTabSpecification;
