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
 *        user_id:
 *          type: number
 *        created_at:
 *          type: string
 *        updated_at:
 *          type: string
 *    
 *    ParsedComment:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        comment:
 *          type: string
 *        user_id:
 *          type: number
 *        created_at:
 *          type: string
 *        updated_at:
 *          type: string
 *        child_comment:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/ParsedChildComment'

 */