import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
      <div className="relative hidden lg:block" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="absolute top-6 left-6 z-10 flex items-center">
          <span className="text-white text-2xl mr-2 font-bold">🚗</span>
          <span className="text-white text-xl font-medium">AutoRent</span>
        </div>
        <div className="absolute bottom-10 left-6 right-6 z-10 flex flex-col text-white">
          <p className="text-xl font-light mb-2">
            "Nie chodzi o to, dokąd jedziesz, ale czym"
          </p>
          <p className="text-sm font-medium">
            Jeremy Clarkson
          </p>
        </div>
        <img
          src="images/car.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover brightness-[0.4] dark:brightness-[0.2] dark:grayscale" />
      </div>
      
      <div className="flex flex-col gap-4 p-6 md:p-10" style={{ backgroundColor: "hsl(0, 0%, 3.9%)" }}>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
}