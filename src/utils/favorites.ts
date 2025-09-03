import type {APIRoute} from 'astro'

type FavoriteFunction = (id: string) => Promise<number | null>

export function createFavoriteAPIRoute(
  favoriteFunction: FavoriteFunction,
  action: 'increment' | 'decrement'
): APIRoute {
  return async ({params}) => {
    const {id} = params

    if (!id) {
      return new Response(JSON.stringify({error: 'ID is required'}), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }

    try {
      const newFavorites = await favoriteFunction(id)

      if (newFavorites === null) {
        return new Response(
          JSON.stringify({error: 'Failed to update favorites'}),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
      }

      return new Response(JSON.stringify({favorites: newFavorites}), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      console.error(`Error ${action}ing favorites:`, error)
      return new Response(JSON.stringify({error: 'Internal server error'}), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
}