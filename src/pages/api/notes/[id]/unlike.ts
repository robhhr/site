import {decrementFavorites} from '../../../../db/models/notes'
import {createFavoriteAPIRoute} from '../../../../utils/favorites'

export const POST = createFavoriteAPIRoute(decrementFavorites, 'decrement')