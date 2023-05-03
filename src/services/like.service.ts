import * as likeModel from '../db/like.model';

export async function addLike(productId: number, userId: number): Promise<void> {
  await likeModel.addLike(productId ,userId);
}

export async function deleteLike(productId: number, userId: number): Promise<void> {
  await likeModel.deleteLike(productId ,userId);
}