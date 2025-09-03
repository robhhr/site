import {incrementFavorites} from '../../../../db/models/thoughts'
import {createFavoriteAPIRoute} from '../../../../utils/favorites'

export const POST = createFavoriteAPIRoute(incrementFavorites, 'increment')

