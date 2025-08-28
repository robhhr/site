import type {APIRoute} from 'astro'
import {incrementFavorites} from '../../../../db/models/thoughts'

export const POST: APIRoute = async ({params}) => {
  const {id} = params

  if (!id) {
    return new Response(JSON.stringify({error: 'thought ID is required'}), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  try {
    const newFavorites = await incrementFavorites(id)

    if (newFavorites === null) {
      return new Response(
        JSON.stringify({error: 'Failed to update favorites'}),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
    }

    return new Response(JSON.stringify({favorites: newFavorites}), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error incrementing favorites:', error)
    return new Response(JSON.stringify({error: 'Internal server error'}), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
}

