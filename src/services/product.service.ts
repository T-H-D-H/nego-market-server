import * as productModel from '../db/product.model';
import * as userService from './user.service';

export async function createProdcut(
    title: string , content: string, imgUrls: string[] | null, price: number, userEmail: string, tags: string[]
) {
    const userId = await userService.getUserIdByEmail(userEmail);
    const imgUrlsJson = JSON.stringify(imgUrls);

    const newProduct =  await productModel.createProdcut(title, content, imgUrlsJson, price, userId, tags);
    
    return newProduct;
}