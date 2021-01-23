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
          <div className="spec__value">{`${product.newWeight || product.weight}  Kg`}</div>
        </div>

        <br />
        <br />

        <h4 className="spec__section-title">Dimensions</h4>
        <div className="spec__row">
          <div className="spec__name">Length</div>
          <div className="spec__value">{`${
            props.product.length ? props.product.length + "cm" : "-"
          }`}</div>
        </div>

        <div className="spec__row">
          <div className="spec__name">Width</div>
          <div className="spec__value">{`${
            props.product.width ? props.product.width + "cm" : "-"
          }`}</div>
        </div>

        <div className="spec__row">
          <div className="spec__name">Height</div>
          <div className="spec__value">{`${
            props.product.height ? props.product.height + "cm" : "-"
          }`}</div>
        </div>
      </div>
    </div>
  );
}

export default ProductTabSpecification;
