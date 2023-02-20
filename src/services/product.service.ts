import * as productModel from '../db/product.model';
import * as userService from './user.service';

export async function createProdcut(
    title: string , content: string, imgUrls: string[] | null, price: number, userEmail: string, tags: string[]
) {
    const userId = await userService.getUserIdByEmail(userEmail);
    const newProduct =  await productModel.createProdcut(title, content, imgUrls, price, userId, tags);
    
    return newProduct;
}