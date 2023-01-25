/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - nickname
 *        - address
 *        - tel
 *      properties:
 *        name:
 *          type: string
 *          default: donghwa
 *        email:
 *          type: string
 *          default: donghwa@example.com
 *        password:
 *          type: string
 *          default: temp1234
 *        nickname:
 *          type: string
 *          default: 동화1212
 *        address:
 *          type: string
 *          default: 부산광역시 해운대구 좌동
 *        tel:
 *          type: string
 *          default: 010-9876-1234
 *    DeleteUserInput:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: donghwa@example.com
 *        password:
 *          type: string
 *          default: temp1234
 */