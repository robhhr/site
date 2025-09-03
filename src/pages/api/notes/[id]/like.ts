import {incrementFavorites} from '../../../../db/models/notes'
import {createFavoriteAPIRoute} from '../../../../utils/favorites'

export const POST = createFavoriteAPIRoute(incrementFavorites, 'increment')