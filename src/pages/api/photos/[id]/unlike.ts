import {decrementFavorites} from '../../../../db/models/photos'
import {createFavoriteAPIRoute} from '../../../../utils/favorites'

export const POST = createFavoriteAPIRoute(decrementFavorites, 'decrement')
