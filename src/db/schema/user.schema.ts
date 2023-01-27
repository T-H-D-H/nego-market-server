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
 *    IdDuplicationCheckInput:
 *      type: object
 *      required:
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          default: donghwa@example.com
 *    IdDuplicationCheckResponse:
 *      type: object
 *      properties:
 *        result:
 *          type: boolean
 *    NicknameDuplicationCheckInput:
 *      type: object
 *      required:
 *        - nickname
 *      properties:
 *        nickname:
 *          type: string
 *          default: 둥둥이2
 *    NicknameDuplicationCheckResponse:
 *      type: object
 *      properties:
 *        result:
 *          type: boolean
 *    TelDuplicationCheckInput:
 *      type: object
 *      required:
 *        - tel
 *      properties:
 *        tel:
 *          type: string
 *          default: 010-0000-0002
 *    TelDuplicationCheckResponse:
 *      type: object
 *      properties:
 *        result:
 *          type: boolean
 *    LoginInput:
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
 *    LoginResponse:
 *      type: object
 *      properties:
 *        token:
 *          type: string
 */
