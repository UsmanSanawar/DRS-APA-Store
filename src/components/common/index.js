// react
import React, { useEffect, useState } from "react";

// third-party
import { Helmet } from "react-helmet";
import RestService from "../../store/restService/restService";
// blocks

// data stubs
import theme from "../../data/theme";
import {
  Fi24Hours48Svg,
  FiFreeDelivery48Svg,
  FiPaymentSecurity48Svg,
  FiTag48Svg,
} from "../../svg";
import { IMAGE_URL } from "../../constant/constants";

function CommonComp(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState([]);
  useEffect(() => {
    setLoading(true);
    RestService.getWebPageComponentByPageSlug(
      props.location ? props.location.pathname.substring(1) : "home"
    )
      .then((res) => {
        if (res.data.status === "success") {
          setData(res.data.data);
          setLoading(false);
        } else {
          setData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        setData([]);
        setLoading(false);
      });
  }, [props.location]);

  function getWith(size, fromHtml = false) {
    let i = 50;
    if (size) {
      if (fromHtml) {
        i = (size[0] / size[2]) * 12;

        return i;
      } else {
        i = (size[0] / size[2]) * 100;
      }
    }
    return `${i}%`;
  }

  function getIcon(icon) {
    let tag = "";
    switch (icon) {
      case "Fi24Hours48Svg":
        tag = <Fi24Hours48Svg />;
        break;

      case "FiTag48Svg":
        tag = <FiTag48Svg />;
        break;

      case "FiFreeDelivery48Svg":
        tag = <FiFreeDelivery48Svg />;
        break;

      case "FiPaymentSecurity48Svg":
        tag = <FiPaymentSecurity48Svg />;
        break;

      default:
        break;
    }
    return tag;
  }

  function getCardPreview(dataList) {
    return (
      <div style={{ backgroundColor: "#fff" }}>
        <div className="container-fluid">
          <div className="row">
            {dataList.map((item) => {
              return (
                <div className="col-lg-3 mt-3">
                  <div
                    className="card p-4"
                    style={{ backgroundColor: "#f7f7f7" }}
                  >
                    <div className="text-center">
                      <div style={{ textAlign: "-webkit-center" }}>
                        {getIcon(item.icon)}
                      </div>
                      <h3 className="mb-0">{item.mainHeading}</h3>
                      <p>{item.subHeading}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  function getDocPreview(dataList) {
    return (
      <div>
        {dataList.map((item) => {
          return (
            <div style={{ margin: 40 }}>
              <div className="text-center">
                <p
                  className="my-2"
                  style={{
                    fontSize: 22,
                    color: "rgb(241, 99, 12)",
                    fontWeight: "bold",
                  }}
                >
                  {item.header}
                </p>
                <p className="my-1">
                  <small>Click to View</small>
                </p>
                {getIcon(item.icon)}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function getPhotoPreview(dataList) {
    return (
      <div className="row">
        {dataList.map((item) => {
          console.log(item, "itemsGroqenc");
          return (
            <div className={`col-lg-${getWith(item.photoSize, true)}`}>
              <div
                style={{
                  backgroundImage: `url(${IMAGE_URL}/images/${item.photoUrl})`,
                  width: "100%",
                  borderRadius: 20,
                  marginBottom: 15,
                  paddingLeft: 30,
                  paddingTop: 30,
                  height: 200,
                }}
              >
                {item.overlayMainText !== "" &&
                item.overlayMainText !== null ? (
                  <h4 style={{ color: item.overlayMainTextColor }}>
                    {item.overlayMainText}
                  </h4>
                ) : null}
                {item.overlaySubTextColor !== "" &&
                item.overlaySubTextColor !== null ? (
                  <h1 style={{ color: item.overlaySubTextColor }}>
                    {item.overlaySubText}
                  </h1>
                ) : null}
                {item.buttonText !== "" && item.buttonText !== null ? (
                  <button
                    onClick={() => (window.location.href = item.buttonLink)}
                    style={{
                      backgroundColor: "rgb(241, 99, 12)",
                      borderRadius: 20,
                      color: "rgb(255, 255, 255)",
                      border: "none",
                      width: 100,
                      padding: 5,
                    }}
                  >
                    {item.buttonText}
                  </button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  function getVideoPreview(dataList) {
    return (
      <div>
        {dataList.map((item) => {
          return (
            <iframe
              width={getWith(item.videoPlayerSize)}
              frameBorder="0"
              height="600"
              src={item.videoUrl}
            ></iframe>
          );
        })}
      </div>
    );
  }

  function getHtmlPreview(dataList) {
    return (
      <div className="row">
        {dataList.map((item) => {
          return (
            <div
              className={`col-lg-${getWith(item.size, true)}`}
              dangerouslySetInnerHTML={{ __html: item.htmlData }}
            />
          );
        })}
      </div>
    );
  }

  const getPreviewHTML = () => {
    let dataList = data.sort((a, b) => a.order - b.order);

    return (
      <div>
        {dataList.map((item) => {
          if (item.webComponent.type === "video") {
            return getVideoPreview(item.webComponent.webVideos);
          } else if (item.webComponent.type === "photo") {
            return getPhotoPreview(item.webComponent.webPhotos);
          } else if (item.webComponent.type === "html") {
            return getHtmlPreview(item.webComponent.webHtmls);
          } else if (item.webComponent.type === "card") {
            return getCardPreview(item.webComponent.webCards);
          } else if (item.webComponent.type === "doc") {
            return getDocPreview(item.webComponent.webDocs);
          }
        })}
      </div>
    );
  };

  return (
    <React.Fragment>
      {/* {getPreviewHTML()} */}
      <Helmet>
        <title>{data.length > 0 ? data[0].webPageTitle : ""} </title>
      </Helmet>

      <div className="container p-4">
        {!loading ? (
          getPreviewHTML()
        ) : (
          <div style={{ textAlign: "center" }}>
            <div className="spinner-border" />
          </div>
        )}
      </div>
    </React.Fragment>
  );
}

export default CommonComp;
