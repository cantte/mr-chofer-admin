import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    const supabase = createServerSupabaseClient({ req, res })

    const { error } = await supabase.auth.signOut()

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json({ message: 'Signed out' })
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
