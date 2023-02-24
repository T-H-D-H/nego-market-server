import * as productModel from "../db/product.model";
import * as tagModel from "../db/tag.model";
import * as userService from "./user.service";

//* 상품 업로드
export async function createProdcut(title: string, content: string, imgUrls: string[], price: number, userEmail: string, tags: string[]) {
  const userId = await userService.getUserIdByEmail(userEmail);
  const imgUrlsJson: string = JSON.stringify(imgUrls);

  await productModel.createProdcut(title, content, imgUrlsJson, price, userId, tags);
}

export async function getProductDetail(productId: number, reqUserId: number) {
  const product = await productModel.getProductDetail(productId);
  const tagName: { name: string }[] = await tagModel.getTagByProductId(productId);
  const tagNameArr = tagName.map((data) => data.name);

  delete product.created_at;

  const likedCount: number = await productModel.getLikedCountByProductId(productId);
  const reqUserLiked = await productModel.hasLiked(productId, reqUserId);

  //* 상품 상세 페이지에 표시될 데이터 파싱
  //* TODO: 댓글 정보 넣기 (댓글 기능 구현 후)
  const productInfo = {
    ...product,
    last_updated_at: product.last_updated_at.toLocaleString("ja-JP", { timeZone: "Asia/Seoul" }),
    tagName: tagNameArr,
    likedCount: likedCount,
    hasReqUserLiked: reqUserLiked === 0 ? false : true,
  };

  return productInfo;
}

export async function getAllProducts() {
  const products = await productModel.getAllProducts();

  for (let i = 0; i < products.length; ++i) {
    let img: string = products[i].img.length == 0 ? "" : products[i].img[0];
    const address_name = `${products[i].si} ${products[i].gu} ${products[i].dong}`;

    delete products[i].si;
    delete products[i].gu;
    delete products[i].dong;

    //* TODO: 댓글 구현 후, 올바른 댓글 갯수 불러오기
    products[i] = {
      ...products[i],
      img: img,
      address: address_name,
      comment: 0,
    };
  }

  return products;
}
