import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method === 'POST') {
    const supabase = createServerSupabaseClient({ req, res })
    const session = await supabase.auth.getSession()

    if (session === null) {
      res.status(401).json({ error: 'No existe sesión' })
      return
    }

    const { id, status } = req.query

    const { error } = await supabase.from('drivers')
      .update({
        status
      })
      .eq('id', id)

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(201).json({ message: 'Actualizado' })
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
