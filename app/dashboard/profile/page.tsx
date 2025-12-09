import { redirect } from 'next/navigation'
import { getProfile, checkEmailVerification } from './actions'
import ProfileForm from './components/ProfileForm'

export default async function ProfilePage() {
  // Получаем данные профиля
  const { data: profile, error } = await getProfile()

  if (error || !profile) {
    redirect('/auth/login')
  }

  // Проверяем статус подтверждения email
  const { verified: emailVerified } = await checkEmailVerification()

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Мой профиль</h1>
      
      <ProfileForm profile={profile} emailVerified={emailVerified} />
    </div>
  )
}
