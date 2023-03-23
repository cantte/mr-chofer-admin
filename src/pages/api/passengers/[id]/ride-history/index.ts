import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { type NextApiRequest, type NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'GET') {
    const supabase = createServerSupabaseClient({ req, res })
    const session = await supabase.auth.getSession()

    if (session === null) {
      res.status(401).json({ error: 'No existe sesión' })
      return
    }

    const { id } = req.query

    const { data, error } = await supabase
      .from('ride_history')
      .select('id, pickup_location, destination, gender, affiliate_id, status')
      .eq('passenger_id', id)

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data)
    return
  }

  // Method not allowed
  res.status(405).json({ error: 'Método no permitido' })
}

export default handler
