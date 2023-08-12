import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Link, useNavigate } from "react-router-dom"

const Login = ()=> {
    const {isLoggedIn, login} = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(()=> {
        if(isLoggedIn) {
            return navigate('/')
        }
    }, [])

    const handleEmailChange = e => {
        setEmail(e.target.value)
    }

    const handlePasswordChange = e => {
        setPassword(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        const userData = { email, password }
        const loginSuccess = login(userData)
        
        if(loginSuccess === true) {
            navigate('/')
        }
    }
    
    return(
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                <div className="container">
                    <h1>Login</h1>
                    <div className="did-floating-label-content">
                        <input 
                        className="did-floating-input" 
                        type="email" 
                        placeholder=" "
                        onChange={handleEmailChange}
                        value={email}
                        />
                        <label className="did-floating-label">Email</label>
                    </div>
                    <div className="did-floating-label-content">
                        <input 
                        className="did-floating-input" 
                        type="password" 
                        onChange={handlePasswordChange}
                        value={password}
                        placeholder=" "/>
                        <label className="did-floating-label">Password</label>
                    </div>

                    <button className="form-button">Login</button>
                    <Link to='/register' className="form-link">Don't have account? register here</Link>
                </div>
            </form>
        </div>
    )
}

export default Login 