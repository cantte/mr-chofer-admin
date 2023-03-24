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
      .from('drivers')
      .select('*, vehicles(*)')
      .eq('id', id)
      .limit(1)

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data[0])
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
