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
 */
