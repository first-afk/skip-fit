import { Activity, Home, User2 } from "lucide-react"
import { useTheme } from "../context/ThemeContext"


const Sidebar = () => {
    const navItems = [
        {path: '/', label: "Home", icon: Home},
        {path: '/activity', label: "Activity", icon: Activity},
        {path: '/profile', label: "Profile", icon: User2},
    ]

    const {theme, toggleTheme} = useTheme()
  return (
    <div>Sidebar</div>
  )
}

export default Sidebar