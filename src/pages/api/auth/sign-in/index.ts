import { type NextApiRequest, type NextApiResponse } from 'next'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const supabase = createServerSupabaseClient({ req, res })

  if (req.method === 'POST') {
    const { email } = req.body.email

    // Check if this email is an admin email
    const { data: admin, error: adminError } = await supabase.from('admin_emails')
      .select()
      .eq('email', email)
      .limit(1)

    if (adminError !== null) {
      res.status(500).json({ error: adminError.message })
      return
    }

    if (admin === undefined || admin?.length === 0) {
      res.status(500).json({ error: 'No eres administrador' })
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword(req.body)

    if (error !== null) {
      res.status(500).json({ error: error.message })
      return
    }

    res.status(200).json(data)
    return
  }

  res.status(405).json({ error: 'Method not allowed' })
}

export default handler
