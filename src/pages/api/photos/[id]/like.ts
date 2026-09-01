import {incrementFavorites} from '../../../../db/models/photos'
import {createFavoriteAPIRoute} from '../../../../utils/favorites'

export const POST = createFavoriteAPIRoute(incrementFavorites, 'increment')
