import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const supabase = createServerSupabaseClient({ req, res })

  if (req.method === 'POST') {
    const { data, error } = await supabase.auth.signInWithPassword(req.body)

    if (error != null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data)
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
