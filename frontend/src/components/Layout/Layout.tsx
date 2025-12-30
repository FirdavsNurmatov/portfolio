import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'

type Props = {
    onToggleTheme: () => void
    mode: 'light' | 'dark'
}

const Layout = ({ onToggleTheme, mode }: Props) => {
    return (
        <>
            <Header onToggleTheme={onToggleTheme} mode={mode} />
            <Outlet />
            <Footer />
        </>
    )
}

export default Layout
