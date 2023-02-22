import * as productModel from "../db/product.model";
import * as tagModel from "../db/tag.model";
import * as userService from "./user.service";

//* 상품 업로드
export async function createProdcut(title: string, content: string, imgUrls: string[], price: number, userEmail: string, tags: string[]) {
  const userId = await userService.getUserIdByEmail(userEmail);
  const imgUrlsJson: string = JSON.stringify(imgUrls);

  await productModel.createProdcut(title, content, imgUrlsJson, price, userId, tags);
}

export async function getProductDetail(productId: number) {
  const product = await productModel.getProductDetail(productId);
  const tagName: { name: string }[] = await tagModel.getTagByProductId(productId);
  const tagNameArr = tagName.map((data) => data.name);

  console.log(product);
  console.log(tagNameArr);

  const productInfo = {
    ...product,
    tagName: tagNameArr,
  };

  console.log(productInfo);

  return product;
}
