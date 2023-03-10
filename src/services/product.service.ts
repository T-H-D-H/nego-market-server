import * as productModel from "../db/product.model";
import * as tagModel from "../db/tag.model";
import * as addressModel from "../db/address.model";
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
    //last_updated_at: product.last_updated_at.toLocaleString("ja-JP", { timeZone: "Asia/Seoul" }),
    tagName: tagNameArr,
    likedCount: likedCount,
    hasReqUserLiked: reqUserLiked === 0 ? false : true,
  };

  return productInfo;
}

export function parseAllProducts(products: any) {
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
    };
  }

  return products;
}

export async function getAllProducts() {
  const products = await productModel.getAllProducts();
  return parseAllProducts(products);
}

export async function getAllProductsByUserAddress(address_id: number) {
  const address = await addressModel.getAddressById(address_id);
  const products = await productModel.getAllProductsByUserAddress(address.si, address.gu, address.dong);

  return parseAllProducts(products);
}

export async function getAllProductsByUserAddressSi(si: string) {
  const products = await productModel.getAllProductsByUserAddressSi(si);

  return parseAllProducts(products);
}

export async function getAllProductsByUserAddressSiGu(si: string, gu: string) {
  const products = await productModel.getAllProductsByUserAddressSiGu(si, gu);

  return parseAllProducts(products);
}

export async function getAllProductsByUserAddressSiGuDong(si: string, gu: string, dong: string) {
  const products = await productModel.getAllProductsByUserAddressSiGuDong(si, gu, dong);

  return parseAllProducts(products);
}

export async function deleteProduct(productId: number): Promise<void> {
//* 유효하지 않은 상품 ID의 경우 예외 처리
  const product = await productModel.getProductDetail(productId);
  if (!product) {
    throw new Error('유효하지 않은 상품 ID 입니다.');
  }

  await productModel.deleteProduct(productId);
}

export async function updateProduct(productId: number, title: string, content: string, price: number) {
  const product = await productModel.getProductDetail(productId);

  // * params로 넘겨받은 상품 ID 가 올바르지 않은 경우
  if (!product) {
    throw new Error('상품이 존재하지 않습니다.');
  }

  // * 상품 업데이트
  await productModel.updateProduct(productId, title, content, price);
  
}