import { Router } from 'express'
import {
    createOrder,
    deleteOrder,
    getOrderByNumber,
    getOrderCurrentUserByNumber,
    getOrders,
    getOrdersCurrentUser,
    updateOrder,
} from '../controllers/order'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import { validateOrderBody, validateOrdersQuery } from '../middlewares/validations'
import { Role } from '../models/user'

const orderRouter = Router()

//С правами админа
orderRouter.get('/all', auth, roleGuardMiddleware(Role.Admin), validateOrdersQuery, getOrders)
orderRouter.get('/:orderNumber', auth, roleGuardMiddleware(Role.Admin), getOrderByNumber )
orderRouter.delete('/:id', auth, roleGuardMiddleware(Role.Admin), deleteOrder)
orderRouter.patch('/:orderNumber', auth, roleGuardMiddleware(Role.Admin), updateOrder)

orderRouter.get('/all/me', auth, getOrdersCurrentUser)
orderRouter.get('/me/:orderNumber', auth, getOrderCurrentUserByNumber)
orderRouter.post('/', auth, validateOrderBody, createOrder)


export default orderRouter
