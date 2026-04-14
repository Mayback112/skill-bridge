import Onboarding from "@/components/onboarding"
import { useNavigate } from "react-router-dom"

export default function OnboardingPage() {
  const navigate = useNavigate()
  
  const handleFinish = () => {
    navigate("/dashboard")
  }

  return <Onboarding onFinish={handleFinish} />
}
