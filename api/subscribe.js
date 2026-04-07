export default async function handler(req, res) {
  // Autorise uniquement les POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Email invalide' });
  }

  try {
    const brevoRes = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY, // variable d'environnement Vercel
      },
      body: JSON.stringify({
        email,
        listIds: [3],        // ← remplace par ton ID de liste Brevo
        updateEnabled: true,
      }),
    });

    // 204 = contact déjà existant mis à jour, 201 = nouveau contact
    if (brevoRes.status === 201 || brevoRes.status === 204) {
      return res.status(200).json({ success: true });
    }

    const error = await brevoRes.json();
    return res.status(400).json({ error: error.message || 'Erreur Brevo' });

  } catch (err) {
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
