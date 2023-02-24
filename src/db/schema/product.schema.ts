/**
 * @openapi
 * components:
 *  schemas:
 *    CreateProductInput:
 *      type: object
 *      required:
 *        - title
 *        - content
 *        - price
 *        - tags
 *        - imgs
 *      properties:
 *        title:
 *          type: string
 *        content:
 *          type: string
 *        price:
 *          type: integer
 *          format: int32
 *        tags:
 *          type: array
 *          items:
 *            type: string
 *          description: "- 최소 1개 ~ 최대 10개"
 *        imgs:
 *          type: array
 *          items:
 *            type: string
 *            format: binary
 *          description: |
 *            - 최대 3장
 *            - 사용 가능 확장자: jpg, jpeg, png
 *            - 파일 용량제한: 10MB
 *    ProductDetail:
 *      type: object
 *      required:
 *        - id
 *        - title
 *        - content
 *        - img
 *        - price
 *        - status
 *        - user_id
 *        - last_updated_at
 *        - tagName
 *        - likedCount
 *        - hasReqUserLiked
 *      properties:
 *        id:
 *          type: integer
 *          description: 상품 ID
 *        title:
 *          type: string
 *          description: 제목
 *        content:
 *          type: string
 *          description: 본문
 *        img:
 *          type: array
 *          items:
 *            type: string
 *          description: 이미지 URL
 *        price:
 *          type: integer
 *          description: 가격
 *        status:
 *          type: integer
 *          description: "판매 상태 (0: 판매 전)"
 *        user_id:
 *          type: integer
 *          description: 상품 업로드 유저
 *        last_updated_at:
 *          type: string
 *          format: custom-date-time
 *          example: "2023/2/23 16:43:36"
 *        tagName:
 *          type: array
 *          items:
 *            type: string
 *          description: 태그 이름
 *        likedCount:
 *          type: integer
 *          description: 좋아요 개수
 *        hasReqUserLiked:
 *          type: boolean
 *          description: 요청한 유저가 좋아요를 눌렀는지 여부
 *    GetProductsByLikes:
 *      type: array
 *      items:
 *        type: object
 *        required:
 *          - id
 *          - user_id
 *          - img
 *          - title
 *          - price
 *          - like_count
 *          - address
 *          - comment
 *        properties:
 *          id:
 *            type: integer
 *            format: int64
 *            description: Product ID
 *          user_id:
 *            type: integer
 *            format: int64
 *            description: User ID of the seller
 *          img:
 *            type: string
 *            description: Image URL of the product
 *          title:
 *            type: string
 *            description: Title of the product
 *          price:
 *            type: integer
 *            description: Price of the product
 *          like_count:
 *            type: integer
 *            description: Number of likes of the product
 *          address:
 *            type: string
 *            description: Address of the product
 *          comment:
 *            type: integer
 *            description: Number of comments of the product
 */
