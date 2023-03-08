/**
 * @openapi
 * components:
 *  schemas:
 *    ParsedChildComment:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        child_comment:
 *          type: string
 *        nickname:
 *          type: string
 *        updated_at:
 *          type: string
 *    
 *    ParsedComment:
 *      type: array
 *      items:
 *        type: object
 *        properties:
 *          id:
 *            type: number
 *          comment:
 *            type: string
 *          nickname:
 *            type: string
 *          updated_at:
 *            type: string
 *          child_comment:
 *            type: array
 *            items:
 *              $ref: '#/components/schemas/ParsedChildComment'
 */