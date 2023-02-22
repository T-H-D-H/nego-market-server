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
 *        imgs:
 *          type: array
 *          items:
 *            type: string
 *            format: binary
 *          description: |
 *            - 최대 3장
 *            - 사용할 가능 확장자: jpg, jpeg, png
 *            - 파일 용량제한: 10MB
 */
