import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

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

    // Count today completed rides
    const { count, error } = await supabase
      .from('rides')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'completed')
      .gte('request_time', new Date().toISOString().split('T')[0])

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json({
      rides: count
    })
  }
}

export default handler
