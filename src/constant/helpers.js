import { IMAGE_URL } from "./constants";
import RestService from "../store/restService/restService";

export function productObjectConverter(item) {

  let images = [];
  if (item.productPhotos && item.productPhotos.length > 0) {

    item.productPhotos.map((image) => {
      if (image.name.startsWith("catalog")) {
        images.push(`${IMAGE_URL}/${image.name}`);
      } else {
        images.push(`${IMAGE_URL}/images/${image.name}`);
      }
    });

  }


  images.push(`${IMAGE_URL}/${item.image}`)

  item.id = item.productId;
  item.name = item.productName;
  item.price = item.price;
  item.model = item.manufacturerName;
  item.compareAtPrice = null; //need be added to DTO
  item.images = images;
  item.badges = [""];
  item.rating = item.totalRating;
  item.reviews = item.totalReviewsCount;
  item.availability = item.stockStatusName;
  item.weight = item.weight;
  item.weightUnit = item.weightUnitName;
  item.length = item.length;
  item.lengthUnit = item.lengthUnitName;
  item.features = [
    { name: "Length", value: item.length + " " + item.lengthUnitName },
    { name: "Width", value: item.width + " " + item.lengthUnitName },
    { name: "Height", value: item.height + " " + item.lengthUnitName },
    {
      name: "Weight",
      value:
        item.weight +
        " " +
        (item.weightUnitName != null ? item.weightUnitName : ""),
    },
  ];
  item.options = item.productOptions;

  return item;
}

export function isTokenValid(token) {
  return true;
}
