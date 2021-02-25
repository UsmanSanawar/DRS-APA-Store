/* eslint-disable no-unused-vars */
import { startCase } from "lodash";
import React from "react";
import { Collapse } from "reactstrap";
import CircularLoader from "../../assets/loaders";

export default function ShippingCollapse({
  open,
  toggle,
  isLoading,
  calculations,
  totalShip
}) {
  let total = 0;

  let shipping = calculations;
  let object = {};
  let itemObject = {};
  if (Object.entries(shipping).length > 0) {
    //? IsOrderEligibleForFreeDelivery=true
    let eligiableTrue = [
      // "parcelWeightNotEligible",
      "totalParcelWeight",
      "parcelPriceNotEligible",

      // "totalBarriersNotEligible",
      "totalBarriers",
      "totalBarrierPriceNotEligible",

      // "totalRetrofitsNotEligible",
      "totalRetrofits",
      "totalRetrofitPricesNotEligible",

      // "totalOperatorsNotEligible",
      "totalOperators",
      "totalOperatorPricesNotEligible",

      "numberOfRacksUsed",
      "totalRackPrice",
    ];

    //? IsOrderEligibleForFreeDelivery=false
    let eligiableFalse = [
      "totalParcelWeight",
      "totalParcelPrice",
      "totalOperators",
      "totalOperatorPrice",
      "totalBarriers",
      "totalBarrierPrice",
      "totalRackPrice",
      "totalRetrofitPrices",
      "numberOfRacksUsed",
      "totalRetrofits",
    ];

    //? Total Delivery Items & Prices in shipment regardless of IsOrderEligibleForFreeDelivery
    let totalItems = [
      "totalParcelWeight",
      "totalOperators",
      "totalBarriers",
      "numberOfRacksUsed",
      "totalRetrofits",
    ];

    let totalPrices = [
      "totalParcelPrice",
      "totalOperatorPrice",
      "totalBarrierPrice",
      "totalRackPrice",
      "totalRetrofitPrices",
    ];


    let condEligible = shipping.isOrderEligibleForFreeDelivery
      ? eligiableTrue
      : eligiableFalse;

    let shippingKeys = Object.keys(shipping);

    // eslint-disable-next-line array-callback-return
    shippingKeys.map((item) => {
      if (
        condEligible.some((arrItem) => arrItem === item) &&
        parseFloat(shipping[item]) > 0
      ) {
        object = {
          ...object,
          [item]: item.includes("Price")
            ? parseFloat(shipping[item])
            : shipping[item],
        };
      }
    });
  }

  const handleKeyReplacer = (key) => {
    let replaceKey = startCase(key);

    let one = replaceKey.replace("Price", "Shipment");
    let two = one.replace("Not Eligible", " ");
    let three = two.replace("Total ", "");
    let four = null;

    if (three.includes("Rack") && three.includes("Shipment")) {
      four = three.replace("Shipment", "Cost");
    }
    return four || three;
  };

  const renderData = (cond) => {
    if (Object.entries(object).length > 0) {
      let sortedCrtObject = {};
      if (cond === "data") {
        let inKey = Object.keys(object);

        let crtObject = {};
        inKey.map((key) => {
          let string = handleKeyReplacer(key);

          if (string.includes("Shipment")) {

            
            total = parseFloat(total) + parseFloat(object[key]);
          }

          crtObject = { ...crtObject, [`${string}`]: object[key] };
          sortedCrtObject = Object.keys(crtObject)
            .sort()
            .reduce((a, c) => ((a[c] = crtObject[c]), a), {});
        });

        let par = Object.keys(sortedCrtObject);
        return par.map((item) => (
          <tr>
            <td>{item}</td>
            <td>
              {(item.includes("Shipment") || item.includes("Cost")) && "£"}
              {item.includes("Weight")
                ? `${parseFloat(sortedCrtObject[item])} Kg`
                : sortedCrtObject[item]}
            </td>
          </tr>
        ));
      }
    }
  };

  return (
    <div>
      <Collapse className="mb-2" isOpen={open} toggle={toggle}>
        {!isLoading ? (
          <div>
            <table className="checkout__totals mt-1">
              <thead className="checkout__totals-header">
                <tr>
                  <th>Title</th>
                  <th>Total</th>
                </tr>
              </thead>

              <tbody className="c1heckout__totals-products">
                {renderData("data")}
                <tr style={{ fontWeight: "bold" }} className="border-top">
                  <td>Total Shipping</td>
                  <td>£{parseFloat(totalShip).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-3">
            <CircularLoader />
          </div>
        )}
      </Collapse>
    </div>
  );
}
