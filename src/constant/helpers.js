import { IMAGE_URL } from "./constants";
import RestService from "../store/restService/restService";

export function productObjectConverter(item) {
  let images = [];
  if (item.productPhotos && item.productPhotos.length > 0) {
    item.productPhotos.map((image) => {
      if (image.name === "" || image.name === null) {
        images.push(
          `${IMAGE_URL}/default/defaultproductpng_22Feb21033359PM.png`
        );
      } else {
        if (image.name.startsWith("catalog")) {
          images.push(`${IMAGE_URL}/${image.name}`);
        } else if(image.name !== '') {
          images.push(`${IMAGE_URL}/images/${image.name}`);
        } else {
          images.push(`${IMAGE_URL}/default/defaultproductpng_22Feb21033359PM.png`);
        }
      }
    });
  }

  images.push(`${IMAGE_URL}/${item.image}`);

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
  item.stockStatusId = item.stockStatusId;
  item.weight = item.weight;
  item.weightUnit = item.weightUnitName;
  item.length = item.length;
  item.lengthUnit = item.lengthUnitName;
  item.features = [
    { name: "Length", value: parseFloat(item.length).toFixed(2) + " cm" },
    { name: "Width", value: parseFloat(item.width).toFixed(2) + " cm" },
    { name: "Height", value: parseFloat(item.height).toFixed(2) + " cm" },
    {
      name: "Weight",
      value:
        parseFloat(item.weight).toFixed(2) +
        " Kg"
    },
  ];
  item.options = item.productOptions;

  return item;
}

export function isTokenValid(token) {
  return true;
}
