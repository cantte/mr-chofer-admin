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

    // const { page } = req.query
    // const rawPage = parseInt(page as string, 10)

    const { data, count, error } = await supabase
      .from('completed_rides_passengers')
      .select('*', { count: 'exact' })
      // .range(rawPage * 10, rawPage * 10 + 10)

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json({
      passengers: data,
      total: count,
      totalPages: Math.ceil((count ?? 10) / 10)
    })
  }
}

export default handler
